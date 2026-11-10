import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Container, useMediaQuery, useTheme } from "@mui/material";
import MainToolbar from "components/MainToolbar";
import UserProfile from "components/UserProfile";
import MainMenu, { BOTTOM_MENU_HEIGHT } from "components/MainMenu";
import appConfig from "app.config";

/**
 * Layout das páginas logadas.
 * Web: appConfig.menu.layout define se o menu fica na lateral ("vertical") ou na barra superior ("horizontal").
 * Mobile: o menu vira uma barra horizontal fixa na parte de baixo da tela.
 */
export default function ProtectedContainer({
  children,
}: React.PropsWithChildren) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
        <MainToolbar action={<UserProfile />}>
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

      {isMobile && <MainMenu orientation="bottom" />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: { xs: 2, md: 3 },
          // reserva o espaço da barra inferior no mobile para não cobrir o conteúdo
          pb: isMobile
            ? `calc(${BOTTOM_MENU_HEIGHT}px + env(safe-area-inset-bottom) + ${theme.spacing(2)})`
            : 3,
        }}
      >
        <Toolbar />
        <Container maxWidth={appConfig.content.maxWidth} disableGutters>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
