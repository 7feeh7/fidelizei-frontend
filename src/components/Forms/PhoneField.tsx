import { Controller, FieldValues } from "react-hook-form";
import { maskPhone } from "utils/phone";
import { CustomTextFieldProps, RoundedTextField } from "./TextField";

/**
 * Campo de telefone com máscara: (85) 98702-0916.
 * O valor do formulário fica mascarado; tire a máscara com onlyDigits antes de enviar à API.
 */
function PhoneField<T extends FieldValues>({
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
          placeholder="(85) 98702-0916"
          {...rest}
          {...field}
          value={maskPhone(field.value)}
          onChange={(event) => field.onChange(maskPhone(event.target.value))}
          onBlur={(event) => {
            field.onBlur();
            onBlur?.(event);
          }}
          inputRef={field.ref}
          inputProps={{ inputMode: "tel", ...rest.inputProps }}
          error={!!error}
          helperText={error?.message ?? rest.helperText}
        />
      )}
    />
  );
}

export default PhoneField;
