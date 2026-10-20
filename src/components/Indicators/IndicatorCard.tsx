import { alpha, Box, Paper, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface IndicatorCardProps {
  icon: ReactNode;
  value: string;
  description: string;
}

function IndicatorCard({ icon, value, description }: IndicatorCardProps) {
  return (
    <Paper
      sx={{
        p: 2.5,
        height: "100%",
        borderRadius: 2,
      }}
    >
      <Stack spacing={1.5}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.5,
            display: "grid",
            placeItems: "center",
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.14),
            color: "primary.main",
            "& svg": { fontSize: 22 },
          }}
        >
          {icon}
        </Box>
        <Typography variant="h5" fontWeight={700} lineHeight={1.2}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default IndicatorCard;
