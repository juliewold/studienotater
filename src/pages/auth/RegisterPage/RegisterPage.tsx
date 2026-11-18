import { useEffect, useState, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../../../components/auth/AuthLayout/AuthLayout";
import { supabase } from "../../../lib/supabase";
import { isUsernameAvailable } from "../../../services/auth/usernameAvailabilityService";
import {
  maxUsernameLength,
  minPasswordLength,
  minUsernameLength,
  passwordRules,
  usernameIsValid,
  usernameRules,
} from "./registerValidation";
import "./RegisterPage.css";

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "unknown";

const hintClass = (ok: boolean) => (ok ? "auth-hint auth-hint-ok" : "auth-hint auth-hint-bad");

export const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  // Result of the last availability check, tagged with the username it was for.
  const [usernameResult, setUsernameResult] = useState<{ name: string; status: UsernameStatus } | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Live availability check, debounced so we do not query on every keystroke.
  useEffect(() => {
    if (!usernameIsValid(username)) return;
    const name = username.trim().toLowerCase();
    const timer = window.setTimeout(async () => {
      const available = await isUsernameAvailable(name);
      const status: UsernameStatus = available === null ? "unknown" : available ? "available" : "taken";
      setUsernameResult({ name, status });
    }, 400);
    return () => window.clearTimeout(timer);
  }, [username]);

  const usernameChecks = usernameRules(username);
  const passwordChecks = passwordRules(password);
  const normalizedUsername = username.trim().toLowerCase();
  const usernameStatus: UsernameStatus = !usernameIsValid(username)
    ? "idle"
    : usernameResult?.name === normalizedUsername
      ? usernameResult.status
      : "checking";
  const canSubmit =
    usernameIsValid(username) &&
    usernameStatus !== "taken" &&
    passwordChecks.length &&
    !isLoading;

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!privacyAccepted) {
      setErrorMessage("Du må lese og godta personvernerklæringen for å opprette konto.");
      return;
    }

    if (usernameStatus === "taken") {
      setErrorMessage("Dette brukernavnet er allerede i bruk. Velg et annet.");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          username: normalizedUsername,
          full_name: fullName.trim(),
        },
      },
    });

    if (error) {
      const message = error.message.toLowerCase();

      if (message.includes("duplicate") || message.includes("username")) {
        setErrorMessage("Dette brukernavnet er allerede i bruk. Velg et annet.");
      } else if (message.includes("already")) {
        setErrorMessage(
          "Det finnes allerede en konto med denne e-postadressen.",
        );
      } else if (message.includes("database error")) {
        // Username uniqueness is enforced when the profile row is created, so a
        // taken username surfaces as this generic Auth error.
        setErrorMessage(
          "Kontoen kunne ikke opprettes. Brukernavnet kan allerede være i bruk. Prøv et annet brukernavn.",
        );
      } else {
        setErrorMessage("Kunne ikke opprette kontoen. Prøv igjen.");
      }

      setIsLoading(false);
      return;
    }

    setSuccessMessage(
      "Kontoen ble opprettet. Du kan nå logge inn.",
    );

    setUsername("");
    setFullName("");
    setEmail("");
    setPassword("");
    setPrivacyAccepted(false);
    setUsernameResult(null);
    setIsLoading(false);
  };

  return (
    <AuthLayout label="Opprett en konto" title="Registrer deg">
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Brukernavn</label>
        <input
          id="username"
          type="text"
          placeholder="Velg et brukernavn"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          minLength={minUsernameLength}
          maxLength={maxUsernameLength}
          pattern="[A-Za-z0-9_\-]+"
          title="Bruk bare bokstaver, tall, bindestrek og understrek."
          aria-describedby="username-hints"
          required
        />
        <div id="username-hints" className="auth-hints" aria-live="polite">
          <p className={hintClass(usernameChecks.length)}>
            {usernameChecks.length ? "✓" : "✗"} {minUsernameLength}–{maxUsernameLength} tegn
          </p>
          <p className={hintClass(usernameChecks.characters)}>
            {usernameChecks.characters ? "✓" : "✗"} Bare bokstaver, tall, bindestrek (-) og understrek (_)
          </p>
          {usernameStatus === "checking" && <p className="auth-hint">Sjekker om brukernavnet er ledig…</p>}
          {usernameStatus === "available" && <p className="auth-hint auth-hint-ok">✓ Brukernavnet er ledig</p>}
          {usernameStatus === "taken" && <p className="auth-hint auth-hint-bad">✗ Brukernavnet er allerede i bruk</p>}
        </div>

        <label htmlFor="fullName">Fullt navn</label>
        <input
          id="fullName"
          type="text"
          placeholder="Ola Nordmann"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          autoComplete="name"
          required
        />

        <label htmlFor="email">E-post</label>
        <input
          id="email"
          type="email"
          placeholder="navn@eksempel.no"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="password">Passord</label>
        <input
          id="password"
          type="password"
          placeholder="Velg et passord"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          minLength={minPasswordLength}
          aria-describedby="password-hints"
          required
        />
        <div id="password-hints" className="auth-hints" aria-live="polite">
          <p className={hintClass(passwordChecks.length)}>
            {passwordChecks.length ? "✓" : "✗"} Minst {minPasswordLength} tegn
          </p>
        </div>

        <label className="auth-checkbox">
          <input
            type="checkbox"
            checked={privacyAccepted}
            onChange={(event) => setPrivacyAccepted(event.target.checked)}
            required
          />
          <span>
            Jeg har lest og godtar{" "}
            <Link to="/personvern">personvernerklæringen</Link>.
          </span>
        </label>

        {errorMessage && (
          <p className="auth-message auth-message-error">
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p className="auth-message auth-message-success">
            {successMessage}
          </p>
        )}

        <button type="submit" disabled={!canSubmit}>
          {isLoading ? "Oppretter konto..." : "Registrer deg"}
        </button>
      </form>

      <p className="auth-switch">
        Har du allerede en konto?{" "}
        <Link to="/logg-inn">Logg inn</Link>
      </p>
    </AuthLayout>
  );
};
