import { Card, Stack, Typography } from "@mui/material";
import React, { FormEvent, PropsWithChildren } from "react";

interface AuthBoxProps {
  title: string;
  subtitle?: string;
  actions: React.ReactNode;
  /** recebe o submit do formulário (Enter ou botão com resolveType="submit") */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => unknown;
  width?: string;
}
function AuthBox({
  title,
  subtitle,
  children,
  actions,
  onSubmit,
  width = "25rem",
}: PropsWithChildren<AuthBoxProps>) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(event);
  }

  return (
    <Card sx={{ width: "100%", maxWidth: width }}>
      <Stack
        component="form"
        noValidate
        onSubmit={handleSubmit}
        spacing={4}
        justifyContent="space-between"
        sx={{
          p: 4,
          minHeight: "25rem",
        }}
      >
        <div>
          <Typography color="text.primary" fontSize={36} fontWeight={700}>
            {title}
          </Typography>
          {subtitle && (
            <Typography color="text.secondary">{subtitle}</Typography>
          )}
        </div>
        <div>{children}</div>
        <div>{actions}</div>
      </Stack>
    </Card>
  );
}

export default AuthBox;
