import { ClipboardEvent, KeyboardEvent, useRef, useState } from "react";
import { Stack } from "@mui/material";
import MuiTextField from "@mui/material/TextField";
import { styled } from "@mui/material";
import { isNumber } from "utils/math";

export const InputCode = styled(MuiTextField)(({ theme }) => ({
  width: 52,
  "& input": {
    color: theme.palette.primary.main,
    fontSize: 24,
    fontWeight: 700,
    textAlign: "center",
    padding: theme.spacing(1.5, 0),
  },
}));

interface DividedFieldProps {
  size: number;
  onChange: (value: string[]) => unknown;
  onlyNumbers?: boolean;
}
function DividedField({
  size,
  onlyNumbers = true,
  onChange,
}: DividedFieldProps) {
  const [code, setCode] = useState<string[]>(() => new Array(size).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isValidChar = (char: string) =>
    !onlyNumbers || (char.trim() !== "" && isNumber(char));

  const updateCode = (newCode: string[]) => {
    setCode(newCode);
    onChange(newCode);
  };

  const handleInputChange = (index: number, value: string) => {
    const char = value.slice(-1);
    if (char && !isValidChar(char)) {
      return;
    }
    const newCode = [...code];
    newCode[index] = char;
    updateCode(newCode);
    if (char) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent) => {
    if (event.key === "Backspace" && !code[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault();
    const chars = event.clipboardData
      .getData("text")
      .trim()
      .split("")
      .filter(isValidChar)
      .slice(0, size);

    updateCode(Array.from({ length: size }, (_, index) => chars[index] ?? ""));
    inputRefs.current[Math.min(chars.length, size - 1)]?.focus();
  };

  return (
    <Stack
      spacing={1}
      direction="row"
      alignItems="center"
      justifyContent="center"
    >
      {code.map((digit, index) => (
        <InputCode
          key={index}
          value={digit}
          autoFocus={index === 0}
          inputRef={(input) => (inputRefs.current[index] = input)}
          onChange={(event) => handleInputChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          inputProps={{
            inputMode: onlyNumbers ? "numeric" : "text",
            autoComplete: index === 0 ? "one-time-code" : "off",
            "aria-label": `Dígito ${index + 1}`,
          }}
        />
      ))}
    </Stack>
  );
}

export default DividedField;
