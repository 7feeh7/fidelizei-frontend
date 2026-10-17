import { DialogContent } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog, { DialogProps } from "@mui/material/Dialog";

function FullLoading(props: DialogProps) {
  return (
    <Dialog
      {...props}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <DialogContent>
        <CircularProgress />
      </DialogContent>
    </Dialog>
  );
}

export default FullLoading;
