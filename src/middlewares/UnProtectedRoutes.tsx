import { Location, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import siteMap from "routes/siteMap";

/** Telas de autenticação: usuário já logado volta para a rota de origem (ou home). */
const UnProtectedMiddleware = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    const from = (location.state as { from?: Location } | null)?.from;
    return <Navigate to={from ?? siteMap.protected.home} replace />;
  }

  return <Outlet />;
};

export default UnProtectedMiddleware;
