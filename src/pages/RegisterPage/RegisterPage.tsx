import { useState, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../../components/AuthLayout/AuthLayout";
import { supabase } from "../../lib/supabase";
import "./RegisterPage.css";

export const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMessage(
        error.message.toLowerCase().includes("already")
          ? "Det finnes allerede en konto med denne e-postadressen."
          : "Kunne ikke opprette kontoen. Prøv igjen.",
      );

      setIsLoading(false);
      return;
    }

    setSuccessMessage(
      "Kontoen ble opprettet. Du kan nå logge inn.",
    );

    setEmail("");
    setPassword("");
    setIsLoading(false);
  };

  return (
    <AuthLayout label="Opprett en konto" title="Registrer deg">
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

        <label htmlFor="password">Passord</label>

        <input
          id="password"
          type="password"
          placeholder="Velg et passord"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
        />

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

        <button type="submit" disabled={isLoading}>
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