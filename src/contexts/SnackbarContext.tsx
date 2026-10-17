import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import {
  createContext,
  forwardRef,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface AlertOptionsProps {
  open: boolean;
  message: string;
  variant: "success" | "error" | "warning" | "info";
}
const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface ContextProps {
  snackError(message: string, error?: unknown): void;
  snackSuccess(message: string): void;
  snackWarning(message: string): void;
}

const Context = createContext({} as ContextProps);

export function SnackbarProvider({ children }: PropsWithChildren) {
  const [snackBar, setSnackBar] = useState({} as AlertOptionsProps);

  const snackError = useCallback((message: string, error?: unknown) => {
    setSnackBar({
      open: true,
      message,
      variant: "error",
    });
    if (error) {
      console.error("@HANDLE_ERROR", error);
    }
  }, []);

  const snackSuccess = useCallback((message: string) => {
    setSnackBar({
      open: true,
      message,
      variant: "success",
    });
  }, []);

  const snackWarning = useCallback((message: string) => {
    setSnackBar({
      open: true,
      message,
      variant: "warning",
    });
  }, []);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBar((prev) => ({ ...prev, open: false }));
  };

  const value = useMemo(
    () => ({ snackError, snackSuccess, snackWarning }),
    [snackError, snackSuccess, snackWarning]
  );

  return (
    <Context.Provider value={value}>
      {children}
      <Snackbar
        open={!!snackBar.open}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snackBar.variant}
          sx={{ width: "100%" }}
        >
          {snackBar.message}
        </Alert>
      </Snackbar>
    </Context.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSnackbarContext() {
  return useContext(Context);
}
