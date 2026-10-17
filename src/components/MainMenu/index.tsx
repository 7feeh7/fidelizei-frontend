import { List, Stack } from "@mui/material";
import { useQuery } from "react-query";
import appConfig, { MenuLayout } from "app.config";
import menuItems from "routes/menu";
import { messageServices } from "services/messages";
import MenuItem from "./MenuItem";

interface MainMenuProps {
  orientation?: MenuLayout;
  /** chamado ao clicar em um item (ex.: fechar o menu no mobile) */
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
