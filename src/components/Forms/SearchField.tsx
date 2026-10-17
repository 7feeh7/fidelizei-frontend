import { FieldValues } from "react-hook-form";
import TextField, { CustomTextFieldProps } from "./TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

function SearchField<T extends FieldValues>(props: CustomTextFieldProps<T>) {
  return (
    <TextField
      {...props}
      InputProps={{
        ...props.InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}

export default SearchField;
