"""Run real disposable local Supabase tests; never loads the repository .env.

Requires Supabase CLI >=2.122.0, Node dependencies, psql and native runtime support.
Use --keep-running for the documented browser acceptance steps, then stop/destroy
only this test stack. All connection details stay in a private /tmp directory.
"""
import argparse
import json
import os
from pathlib import Path
import shutil
import socket
import subprocess
import tempfile
import time
import urllib.error
import urllib.request


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--supabase", default="supabase", help="Path to the official CLI executable")
    parser.add_argument("--keep-running", action="store_true", help="Keep the synthetic stack/frontend for browser tests")
    args = parser.parse_args()
    repo = Path(__file__).resolve().parent.parent
    root = Path(tempfile.mkdtemp(prefix="studienotater-account-integration-", dir="/tmp"))
    env = {key: value for key, value in os.environ.items() if key in (
        "PATH", "HOME", "USER", "LOGNAME", "TMPDIR", "LANG", "LC_ALL", "SHELL"
    )}
    env.update(SUPABASE_HOME=str(root / "home"), SUPABASE_EXPERIMENTAL_STACK="1")
    (root / "supabase/functions").mkdir(parents=True)
    shutil.copytree(repo / "supabase/functions/delete-account", root / "supabase/functions/delete-account")
    (root / "supabase/config.toml").write_text('''project_id = "account-deletion-isolated"
[experimental]
stack = true
[functions.delete-account]
verify_jwt = false
[auth]
site_url = "http://127.0.0.1:5189/studienotater/"
[auth.email]
enable_confirmations = false
''')
    function_env = root / "supabase/functions/.env"
    function_env.write_text("ACCOUNT_DELETION_ENABLED=true\nACCOUNT_DELETION_ALLOW_LOCAL=true\nACCOUNT_DELETION_ORIGINS=http://127.0.0.1:5189\n")
    function_env.chmod(0o600)
    frontend = None
    ready = False
    try:
        # CLI startup/status output includes LOCAL keys. Never echo it to a log
        # consumer, PR, or stdout. This folder contains synthetic test data only.
        with (root / "startup.log").open("w") as log:
            subprocess.run([args.supabase, "start", "--runtime", "native", "--exclude",
                            "studio,analytics,realtime,pooler,mail", "--eager"],
                           cwd=root, env=env, stdout=log, stderr=subprocess.STDOUT, check=True)
        status = subprocess.run([args.supabase, "status", "--output-format", "json"],
                                cwd=root, env=env, capture_output=True, text=True, check=True)
        data = json.loads(status.stdout)
        connection = root / "connection.json"
        connection.write_text(json.dumps(data))
        connection.chmod(0o600)
        for mode in ("setup", "run"):
            subprocess.run(["node", "tests/account-deletion.integration.mjs", str(root), mode],
                           cwd=repo, env=env, check=True)
        if args.keep_running:
            # Do not accidentally use a pre-existing frontend with a different
            # environment if this dedicated test port is already occupied.
            with socket.socket() as probe:
                probe.bind(("127.0.0.1", 5189))
            frontend_env = root / "frontend-env"
            frontend_env.mkdir()
            dotenv = frontend_env / ".env"
            dotenv.write_text("VITE_SUPABASE_URL=" + data["env"]["API_URL"] +
                              "\nVITE_ACCOUNT_DELETION_ENABLED=true\nVITE_SUPABASE_ANON_KEY=" + data["env"]["PUBLISHABLE_KEY"] + "\n")
            dotenv.chmod(0o600)
            config = root / "vite.integration.config.mjs"
            # envDir excludes production .env files even though components load
            # from the actual repo. The child inherits no VITE/cloud credentials.
            config.write_text("import react from " + json.dumps(str(repo / "node_modules/@vitejs/plugin-react/dist/index.js")) +
                              ";\nexport default {root:" + json.dumps(str(repo)) +
                              ',base:"/studienotater/",envDir:' + json.dumps(str(frontend_env)) +
                              ',plugins:[react()],server:{host:"127.0.0.1",port:5189,strictPort:true}};\n')
            with (root / "frontend.log").open("w") as log:
                frontend = subprocess.Popen(["node", "node_modules/vite/bin/vite.js", "--config", str(config)],
                                            cwd=repo, env=env, stdout=log, stderr=subprocess.STDOUT,
                                            start_new_session=True)
            (root / "frontend.pid").write_text(str(frontend.pid))
            for attempt in range(40):
                if frontend.poll() is not None:
                    raise RuntimeError("Isolated frontend failed to start")
                try:
                    with urllib.request.urlopen("http://127.0.0.1:5189/studienotater/tests/account-deletion.integration.html", timeout=1) as response:
                        if response.status == 200:
                            break
                except (OSError, urllib.error.URLError):
                    pass
                time.sleep(0.25)
            else:
                raise RuntimeError("Isolated frontend did not become ready")
            print("Browser acceptance URL: http://127.0.0.1:5189/studienotater/tests/account-deletion.integration.html#/logg-inn")
        ready = True
        print("Synthetic-only test directory:", root)
    finally:
        if not (args.keep_running and ready):
            if frontend:
                frontend.terminate()
                frontend.wait(timeout=15)
            subprocess.run([args.supabase, "stop"], cwd=root, env=env,
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)


if __name__ == "__main__":
    try:
        main()
    except (OSError, subprocess.SubprocessError, ValueError, RuntimeError) as error:
        # CLI/API status may contain credentials; report the class, not captured
        # command output. Inspect the private synthetic-only logs locally.
        raise SystemExit("Local integration setup failed: " + type(error).__name__)
