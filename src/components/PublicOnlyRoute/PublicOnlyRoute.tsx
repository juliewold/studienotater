import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext/AuthContext";

type PublicOnlyRouteProps = {
  children: React.ReactNode;
};

export const PublicOnlyRoute = ({
  children,
}: PublicOnlyRouteProps) => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <main className="page-container">
        <p>Laster...</p>
      </main>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};