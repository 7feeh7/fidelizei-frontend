import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { DialogTitle, Stack, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import React from "react";

interface TitleContentProps {
  component?: React.ReactNode;
  subtitle?: string;
  label?: string;
}
function TitleContent({ component, subtitle, label }: TitleContentProps) {
  return component ? (
    <>{component}</>
  ) : (
    <Stack>
      <Typography fontWeight={700}>{label}</Typography>
      {subtitle && <Typography>{subtitle}</Typography>}
    </Stack>
  );
}

interface FastDialogTitleProps {
  label?: string;
  subtitle?: string;
  component?: React.ReactNode;
  backButton?: () => void;
  closeButton?: () => void;
}
function FastDialogTitle({
  label,
  component,
  subtitle,
  closeButton,
  backButton,
}: FastDialogTitleProps) {
  return (
    <DialogTitle>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center">
          {backButton && (
            <IconButton color="primary" onClick={backButton}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <TitleContent
            component={component}
            subtitle={subtitle}
            label={label}
          />
        </Stack>
        {closeButton && (
          <IconButton color="primary" onClick={closeButton} aria-label="Fechar">
            <CloseIcon />
          </IconButton>
        )}
      </Stack>
    </DialogTitle>
  );
}

export default FastDialogTitle;
