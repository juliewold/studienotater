import { useState, type SyntheticEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "../../components/AuthLayout/AuthLayout";
import { supabase } from "../../lib/supabase";
import "./LoginPage.css";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage("Feil e-post eller passord.");
      setIsLoading(false);
      return;
    }

    const from = location.state?.from ?? "/";

    navigate(from, { replace: true });
  };

  return (
    <AuthLayout label="Velkommen tilbake" title="Logg inn">
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
          placeholder="Skriv inn passordet ditt"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />

        {errorMessage && (
          <p className="auth-message auth-message-error">{errorMessage}</p>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logger inn..." : "Logg inn"}
        </button>
      </form>
    </AuthLayout>
  );
};
