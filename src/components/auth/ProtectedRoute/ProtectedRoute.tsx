import { useContext, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext/AuthContext";
import { LoadingPlaceholder } from "../../common/LoadingPlaceholder/LoadingPlaceholder";

type ProtectedRouteProps = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="page-container">
        <LoadingPlaceholder label="Sjekker innlogging…" height={320} />
      </main>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/logg-inn"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
};