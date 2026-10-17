import { List, Stack } from "@mui/material";
import appConfig, { MenuLayout } from "app.config";
import menuItems from "routes/menu";
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
  const items = menuItems.map((item) => (
    <MenuItem
      key={item.path}
      {...item}
      orientation={orientation}
      onClick={onNavigate}
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
