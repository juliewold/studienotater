import { useState, type SyntheticEvent } from "react";
import { AuthLayout } from "../../components/AuthLayout/AuthLayout";
import { supabase } from "../../lib/supabase";
import "./RegisterPage.css";

export const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error(error.message);
      return;
    }

    console.log("Registrering vellykket");
  };

  return (
    <AuthLayout
      label="Opprett en konto"
      title="Registrer deg"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="email">E-post</label>
        <input
          id="email"
          type="email"
          placeholder="navn@eksempel.no"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Passord</label>
        <input
          id="password"
          type="password"
          placeholder="Velg et passord"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit">Registrer deg</button>
      </form>
    </AuthLayout>
  );
};