import "./LoginPage.css";
import { AuthLayout } from "../../components/AuthLayout/AuthLayout";

export const LoginPage = () => {
  return (
    <AuthLayout
      label="Velkommen tilbake"
      title="Logg inn"
    >
      <form className="auth-form">
        <label htmlFor="email">E-post</label>
        <input
          id="email"
          type="email"
          placeholder="navn@eksempel.no"
        />

        <label htmlFor="password">Passord</label>
        <input
          id="password"
          type="password"
          placeholder="Skriv inn passordet ditt"
        />

        <button type="submit">Logg inn</button>
      </form>
    </AuthLayout>
  );
};