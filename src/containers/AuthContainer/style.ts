import { styled } from "@mui/material/styles";

export const AuthContent = styled("div")(({ theme }) => ({
  display: "flex",
  width: "100%",
  minHeight: "100vh",
  background: theme.palette.background.default,
}));

export const LogoPanel = styled("div")(({ theme }) => ({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  background: theme.palette.background.paper,
  "& img": {
    maxWidth: "70%",
    maxHeight: "60vh",
  },
}));

export const FormPanel = styled("div")(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(4),
  padding: theme.spacing(2),
}));
