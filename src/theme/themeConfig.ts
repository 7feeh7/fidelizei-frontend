import type {} from "@mui/lab/themeAugmentation";
import { createTheme } from "@mui/material/styles";
import { ptBR } from "@mui/material/locale";
import colors from "./colors";

const theme = createTheme(
  {
    palette: {
      primary: {
        main: colors.primary,
      },
      secondary: {
        main: colors.secondary,
      },
      error: {
        main: colors.error,
      },
      background: {
        default: colors.background,
        paper: colors.surface,
      },
      text: {
        primary: colors.textPrimary,
        secondary: colors.textSecondary,
      },
    },
    // typography: {
    //   button: {
    //     textTransform: 'none'
    //   }
    // },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          a: {
            color: colors.primary,
          },
        },
      },
      MuiButton: {
        defaultProps: {
          variant: "contained",
        },
      },
      MuiLoadingButton: {
        defaultProps: {
          variant: "contained",
        },
      },
    },
  },
  ptBR
);

export default theme;
