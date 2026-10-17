import MuiTextField, { TextFieldProps } from "@mui/material/TextField";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { styled } from "@mui/material";

export type CustomTextFieldProps<T extends FieldValues = FieldValues> = {
  control?: Control<T>;
  name: Path<T>;
  rounded?: boolean;
} & Omit<TextFieldProps, "name">;

export const RoundedTextField = styled(MuiTextField, {
  shouldForwardProp: (prop) => prop !== "rounded",
})<TextFieldProps & { rounded?: boolean }>(({ rounded = true }) => ({
  fieldset: {
    borderRadius: rounded ? 50 : undefined,
  },
}));

function TextField<T extends FieldValues>({
  name,
  control,
  onBlur,
  ...rest
}: CustomTextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <RoundedTextField
          size="small"
          fullWidth
          {...rest}
          {...field}
          value={field.value ?? ""}
          onBlur={(event) => {
            field.onBlur();
            onBlur?.(event);
          }}
          inputRef={field.ref}
          error={!!error}
          helperText={error?.message ?? rest.helperText}
        />
      )}
    />
  );
}

export default TextField;
