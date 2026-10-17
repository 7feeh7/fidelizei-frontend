import { IconButton, Stack, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import appConfig from "app.config";
import siteMap from "routes/siteMap";
import { Logo } from "./style";

interface MainToolbarProps {
  /** conteúdo à direita (ex.: perfil do usuário) */
  action?: ReactNode;
  /** quando informado, mostra o botão hambúrguer */
  onMenuClick?: () => void;
  /** conteúdo central (ex.: menu horizontal) */
  children?: ReactNode;
}
function MainToolbar({ action, onMenuClick, children }: MainToolbarProps) {
  return (
    <Toolbar sx={{ gap: 2 }}>
      {onMenuClick && (
        <IconButton edge="start" onClick={onMenuClick} aria-label="Abrir menu">
          <MenuIcon />
        </IconButton>
      )}
      <Link to={siteMap.protected.home}>
        <Logo src={appConfig.logo.compact} alt={appConfig.name} />
      </Link>
      <Stack
        direction="row"
        sx={{ flexGrow: 1, minWidth: 0, alignSelf: "stretch" }}
      >
        {children}
      </Stack>
      {action}
    </Toolbar>
  );
}

export default MainToolbar;
