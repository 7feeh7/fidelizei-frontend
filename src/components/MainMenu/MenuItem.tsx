import {
  Badge,
  Button,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { NavLink, useMatch, useResolvedPath } from "react-router-dom";
import { MenuLayout } from "app.config";
import { MenuItemConfig } from "routes/menu";

interface MenuItemProps extends MenuItemConfig {
  orientation: MenuLayout;
  onClick?: () => void;
  badgeCount?: number;
}
function MenuItem({
  label,
  icon,
  path,
  orientation,
  onClick,
  badgeCount,
}: MenuItemProps) {
  const iconWithBadge =
    icon && badgeCount && badgeCount > 0 ? (
      <Badge color="error" badgeContent={badgeCount} max={99}>
        {icon}
      </Badge>
    ) : (
      icon
    );
  const resolved = useResolvedPath(path);
  const active = !!useMatch({ path: resolved.pathname, end: path === "/" });

  if (orientation === "horizontal") {
    return (
      <Button
        component={NavLink}
        to={path}
        onClick={onClick}
        startIcon={iconWithBadge}
        variant="text"
        color={active ? "primary" : "inherit"}
        sx={{
          px: 2,
          borderRadius: 0,
          whiteSpace: "nowrap",
          borderBottom: 3,
          borderColor: active ? "primary.main" : "transparent",
        }}
      >
        {label}
      </Button>
    );
  }

  return (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        component={NavLink}
        to={path}
        onClick={onClick}
        selected={active}
        sx={{ borderRadius: 2 }}
      >
        {iconWithBadge && (
          <ListItemIcon sx={{ color: active ? "primary.main" : undefined }}>
            {iconWithBadge}
          </ListItemIcon>
        )}
        <ListItemText
          primary={label}
          primaryTypographyProps={{ fontWeight: active ? 700 : undefined }}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default MenuItem;
