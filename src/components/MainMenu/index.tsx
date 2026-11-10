import { List, Paper, Stack } from "@mui/material";
import { useQuery } from "react-query";
import appConfig, { MenuLayout } from "app.config";
import menuItems from "routes/menu";
import { messageServices } from "services/messages";
import MenuItem from "./MenuItem";

/** altura da barra inferior do mobile, em px (o conteúdo da página reserva esse espaço) */
export const BOTTOM_MENU_HEIGHT = 64;

/** "bottom": barra inferior fixa, usada no mobile */
export type MenuOrientation = MenuLayout | "bottom";

interface MainMenuProps {
  orientation?: MenuOrientation;
  /** chamado ao clicar em um item */
  onNavigate?: () => void;
}
function MainMenu({
  orientation = appConfig.menu.layout,
  onNavigate,
}: MainMenuProps) {
  const { data: pendingCountData } = useQuery(
    ["messages-pending-count"],
    () => messageServices.pendingCount(),
    { refetchInterval: 60_000 }
  );

  const pendingCount = pendingCountData?.pendingCount ?? 0;

  const items = menuItems.map((item) => (
    <MenuItem
      key={item.path}
      {...item}
      orientation={orientation}
      onClick={onNavigate}
      badgeCount={
        item.showPendingMessagesBadge ? pendingCount : undefined
      }
    />
  ));

  if (orientation === "bottom") {
    return (
      <Paper
        component="nav"
        elevation={8}
        square
        sx={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          display: "flex",
          height: `calc(${BOTTOM_MENU_HEIGHT}px + env(safe-area-inset-bottom))`,
          pb: "env(safe-area-inset-bottom)",
        }}
      >
        {items}
      </Paper>
    );
  }

  if (orientation === "horizontal") {
    return (
      <Stack
        component="nav"
        direction="row"
        spacing={1}
        sx={{ height: "100%", overflowX: "auto" }}
      >
        {items}
      </Stack>
    );
  }

  return (
    <List component="nav" sx={{ px: 1 }}>
      {items}
    </List>
  );
}

export default MainMenu;
