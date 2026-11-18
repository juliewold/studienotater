import { LoadingPlaceholder } from "../../common/LoadingPlaceholder/LoadingPlaceholder";
import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext/AuthContext";

type AdminRouteProps = {
  children: ReactNode;
};

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isAdmin, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <main className="page-container">
        <LoadingPlaceholder label="Laster..." />
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/logg-inn" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};