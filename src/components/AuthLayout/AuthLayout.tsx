import type { ReactNode } from "react";
import "./AuthLayout.css";

type AuthLayoutProps = {
  label: string;
  title: string;
  children: ReactNode;
};

export const AuthLayout = ({
  label,
  title,
  children,
}: AuthLayoutProps) => {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="auth-label">{label}</p>
        <h1>{title}</h1>

        {children}
      </section>
    </main>
  );
};