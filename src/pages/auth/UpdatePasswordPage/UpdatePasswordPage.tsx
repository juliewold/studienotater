import { useEffect, useState, type SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../../../components/auth/AuthLayout/AuthLayout";
import { supabase } from "../../../lib/supabase";
import "./UpdatePasswordPage.css";

export const UpdatePasswordPage = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPreparingSession, setIsPreparingSession] = useState(true);

  useEffect(() => {
    const prepareRecoverySession = async () => {
      setErrorMessage("");

      try {
        // Med HashRouter blir URL-en:
        // #/oppdater-passord#access_token=...
        const hashParts = window.location.hash.split("#");
        const tokenPart = hashParts.find((part) =>
          part.includes("access_token="),
        );

        if (tokenPart) {
          const params = new URLSearchParams(tokenPart);

          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          if (!accessToken || !refreshToken) {
            setErrorMessage(
              "Tilbakestillingslenken er ugyldig eller mangler informasjon.",
            );
            return;
          }

          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            setErrorMessage(
              "Tilbakestillingslenken er ugyldig eller har utløpt.",
            );
            return;
          }

          // Fjerner tokenene fra adresselinjen etter at økten er opprettet.
          window.history.replaceState(
            null,
            "",
            `${window.location.pathname}#/oppdater-passord`,
          );
        } else {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (!session) {
            setErrorMessage(
              "Tilbakestillingslenken er ugyldig eller har utløpt.",
            );
          }
        }
      } catch (error) {
        console.error("Kunne ikke opprette recovery-session:", error);

        setErrorMessage("Kunne ikke åpne tilbakestillingslenken.");
      } finally {
        setIsPreparingSession(false);
      }
    };

    prepareRecoverySession();
  }, []);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passordene er ikke like.");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      console.error("Kunne ikke oppdatere passord:", error);

      setErrorMessage("Kunne ikke oppdatere passordet. Lenken kan ha utløpt.");
      setIsLoading(false);
      return;
    }

    // Recovery-lenken logger brukeren inn midlertidig.
    // Vi logger ut slik at brukeren kan teste det nye passordet.
    await supabase.auth.signOut();

    navigate("/logg-inn", { replace: true });
  };

  if (isPreparingSession) {
    return (
      <AuthLayout label="Velg nytt passord" title="Oppdater passord">
        <p>Laster tilbakestillingslenken...</p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout label="Velg nytt passord" title="Oppdater passord">
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="password">Nytt passord</label>

        <input
          id="password"
          type="password"
          placeholder="Nytt passord"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
        />

        <label htmlFor="confirmPassword">Bekreft passord</label>

        <input
          id="confirmPassword"
          type="password"
          placeholder="Gjenta passord"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
        />

        {errorMessage && (
          <p className="auth-message auth-message-error">{errorMessage}</p>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Oppdaterer..." : "Oppdater passord"}
        </button>
      </form>
    </AuthLayout>
  );
};