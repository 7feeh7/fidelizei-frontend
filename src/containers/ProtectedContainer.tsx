import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Container, useMediaQuery, useTheme } from "@mui/material";
import MainToolbar from "components/MainToolbar";
import UserProfile from "components/UserProfile";
import MainMenu from "components/MainMenu";
import appConfig from "app.config";

/**
 * Layout das páginas logadas.
 * appConfig.menu.layout define se o menu fica na lateral ("vertical") ou na barra superior ("horizontal").
 * No mobile, os dois viram um drawer aberto pelo botão hambúrguer.
 */
export default function ProtectedContainer({
  children,
}: React.PropsWithChildren) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isVertical = appConfig.menu.layout === "vertical";
  const drawerWidth = appConfig.menu.width;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={1}
        sx={{ zIndex: theme.zIndex.drawer + 1 }}
      >
        <MainToolbar
          action={<UserProfile />}
          onMenuClick={isMobile ? () => setMobileOpen(true) : undefined}
        >
          {!isVertical && !isMobile && <MainMenu orientation="horizontal" />}
        </MainToolbar>
      </AppBar>

      {isVertical && !isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ mt: 1 }}>
            <MainMenu orientation="vertical" />
          </Box>
        </Drawer>
      )}

      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ [`& .MuiDrawer-paper`]: { width: drawerWidth } }}
        >
          <Toolbar />
          <MainMenu
            orientation="vertical"
            onNavigate={() => setMobileOpen(false)}
          />
        </Drawer>
      )}

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: 3 }}>
        <Toolbar />
        <Container maxWidth={appConfig.content.maxWidth} disableGutters>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
