import { Navigate, Outlet, useLocation } from "react-router-dom";
import ProtectedContainer from "containers/ProtectedContainer";
import { useAuth } from "contexts/AuthContext";
import siteMap from "routes/siteMap";

/** Só deixa passar usuário logado; senão manda para o login guardando a rota de origem. */
const ProtectedMiddleware = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate to={siteMap.auth.login} replace state={{ from: location }} />
    );
  }

  return (
    <ProtectedContainer>
      <Outlet />
    </ProtectedContainer>
  );
};

export default ProtectedMiddleware;
