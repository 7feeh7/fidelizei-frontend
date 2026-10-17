import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

export interface AutoCompleteOption {
  label: string;
  value: string | number;
}

interface AutoCompleteFieldProps<T extends FieldValues> {
  control?: Control<T>;
  name: Path<T>;
  options: AutoCompleteOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
}

/** Autocomplete integrado ao react-hook-form: o valor do campo é `option.value`. */
function AutoCompleteField<T extends FieldValues>({
  control,
  name,
  options,
  label,
  placeholder,
  disabled,
  loading,
}: AutoCompleteFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          options={options}
          disabled={disabled}
          loading={loading}
          value={options.find((option) => option.value === field.value) ?? null}
          onChange={(_, option) => field.onChange(option?.value ?? null)}
          onBlur={field.onBlur}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderInput={(params) => (
            <TextField
              {...params}
              inputRef={field.ref}
              label={label}
              placeholder={placeholder}
              size="small"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      )}
    />
  );
}

export default AutoCompleteField;
