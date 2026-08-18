import { useState, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../../components/AuthLayout/AuthLayout";
import { supabase } from "../../lib/supabase";
import "./ForgotPasswordPage.css";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${window.location.pathname}#/oppdater-passord`,
    });

    if (error) {
      setErrorMessage("Kunne ikke sende e-post.");
      setIsLoading(false);
      return;
    }

    setSuccessMessage(
      "Hvis det finnes en konto med denne e-postadressen, har vi sendt deg en e-post med instruksjoner.",
    );

    setEmail("");
    setIsLoading(false);
  };

  return (
    <AuthLayout label="Tilbakestill passord" title="Glemt passord?">
      <form className="auth-form" onSubmit={handleSubmit}>
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

        {errorMessage && (
          <p className="auth-message auth-message-error">{errorMessage}</p>
        )}

        {successMessage && (
          <p className="auth-message auth-message-success">{successMessage}</p>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Sender e-post..." : "Send tilbakestillingslenke"}
        </button>
      </form>

      <p className="auth-switch">
        <Link to="/logg-inn">← Tilbake til innlogging</Link>
      </p>
    </AuthLayout>
  );
};
