import AppBar from "@mui/material/AppBar";
import MainToolbar from "components/MainToolbar";
import UserProfile from "components/UserProfile";

function Toolbar() {
  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <MainToolbar action={<UserProfile />} />
    </AppBar>
  );
}

export default Toolbar;
