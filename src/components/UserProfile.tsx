import {
  Avatar,
  ButtonBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import siteMap from "routes/siteMap";
import colors from "theme/colors";

function UserProfile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  function closeMenu() {
    setAnchorEl(null);
  }

  function goToProfile() {
    closeMenu();
    navigate(siteMap.protected.profile);
  }
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!user) {
    return null;
  }

  return (
    <>
      <ButtonBase
        onClick={(event) => setAnchorEl(event.currentTarget)}
        sx={{ borderRadius: 2, p: 0.5 }}
        aria-label="Menu do usuário"
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {!isMobile && (
            <Stack alignItems="flex-end">
              <Typography fontWeight="bold" color={colors.neutral1}>
                {user.name}
              </Typography>
              {user.role && (
                <Typography variant="body2" color={colors.neutral3}>
                  {user.role}
                </Typography>
              )}
            </Stack>
          )}
          <Avatar src={user.avatar} alt={user.name}>
            {user.name?.charAt(0).toUpperCase()}
          </Avatar>
        </Stack>
      </ButtonBase>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={goToProfile}>
          <ListItemIcon>
            <PersonOutlineIcon fontSize="small" />
          </ListItemIcon>
          Perfil
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu();
            signOut();
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Sair
        </MenuItem>
      </Menu>
    </>
  );
}

export default UserProfile;
