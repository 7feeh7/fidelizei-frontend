import React from "react";
import { FieldValues } from "react-hook-form";
import TextField, { CustomTextFieldProps } from "./TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

function PasswordField<T extends FieldValues>(props: CustomTextFieldProps<T>) {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <TextField
      {...props}
      type={showPassword ? "text" : "password"}
      InputProps={{
        ...props.InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword((prev) => !prev)}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

export default PasswordField;
