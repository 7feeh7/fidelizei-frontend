import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import siteMap from "routes/siteMap";
import { setUnauthorizedHandler } from "services/handlers";

/** Em 401 da API: encerra a sessão e envia o usuário para o login. */
export default function UnauthorizedHandler() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      signOut();
      navigate(siteMap.auth.login, { replace: true });
    });

    return () => setUnauthorizedHandler(undefined);
  }, [navigate, signOut]);

  return null;
}
