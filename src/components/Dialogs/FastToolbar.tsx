import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

interface FastToolbarProps {
  title?: string;
  onClose?: () => void;
}
function FastToolbar(props: FastToolbarProps) {
  return (
    <AppBar sx={{ position: "relative" }}>
      <Toolbar>
        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
          {props.title}
        </Typography>
        {props.onClose && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={props.onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default FastToolbar;
