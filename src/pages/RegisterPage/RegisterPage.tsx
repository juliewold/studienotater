import { useState, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../../components/AuthLayout/AuthLayout";
import { supabase } from "../../lib/supabase";
import "./RegisterPage.css";

export const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
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

    const normalizedUsername = username.trim().toLowerCase();

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
        setErrorMessage("Dette brukernavnet er allerede i bruk.");
      } else if (message.includes("already")) {
        setErrorMessage(
          "Det finnes allerede en konto med denne e-postadressen.",
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
          minLength={3}
          maxLength={30}
          pattern="[A-Za-z0-9_-]+"
          title="Bruk bare bokstaver, tall, bindestrek og understrek."
          required
        />

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