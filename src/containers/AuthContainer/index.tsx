import { useMediaQuery, useTheme } from "@mui/material";
import { PropsWithChildren } from "react";
import appConfig, { AuthFormSide, AuthLayout } from "app.config";
import { AuthContent, FormPanel, LogoPanel } from "./style";

interface AuthContainerProps {
  /** padrão: appConfig.auth.layout */
  layout?: AuthLayout;
  /** padrão: appConfig.auth.formSide */
  formSide?: AuthFormSide;
}
function AuthContainer({
  children,
  layout = appConfig.auth.layout,
  formSide = appConfig.auth.formSide,
}: PropsWithChildren<AuthContainerProps>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // no mobile o layout "split" vira "centered"
  const showLogoPanel = layout === "split" && !isMobile;

  return (
    <AuthContent
      sx={{ flexDirection: formSide === "left" ? "row-reverse" : "row" }}
    >
      {showLogoPanel && (
        <LogoPanel>
          <img src={appConfig.logo.full} alt={appConfig.name} />
        </LogoPanel>
      )}

      <FormPanel>
        {!showLogoPanel && (
          <img src={appConfig.logo.compact} alt={appConfig.name} height={40} />
        )}
        {children}
      </FormPanel>
    </AuthContent>
  );
}

export default AuthContainer;
