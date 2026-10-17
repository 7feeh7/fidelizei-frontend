import { CircularProgress, Stack } from "@mui/material";

function MainLoading() {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{
        height: "100%",
        minHeight: 120,
      }}
    >
      <CircularProgress />
    </Stack>
  );
}

export default MainLoading;
