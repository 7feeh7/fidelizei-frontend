import { PropsWithChildren } from "react";
import { Container } from "@mui/material";
import appConfig from "app.config";
import Toolbar from "./Toolbar";
import { MainContent } from "./style";

/** Layout simples (barra superior sem menu), para páginas fora do ProtectedContainer. */
function MainContainer({ children }: PropsWithChildren) {
  return (
    <MainContent>
      <Toolbar />
      <Container maxWidth={appConfig.content.maxWidth} sx={{ py: 5 }}>
        {children}
      </Container>
    </MainContent>
  );
}

export default MainContainer;
