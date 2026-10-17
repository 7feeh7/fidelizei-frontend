import Routes from "routes";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClientProvider } from "react-query";
import theme from "theme/themeConfig";
import { queryClient } from "services/queryClient";
import { SnackbarProvider } from "contexts/SnackbarContext";
import { AuthProvider } from "contexts/AuthContext";
import "./main.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Routes />
          </AuthProvider>
        </QueryClientProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
