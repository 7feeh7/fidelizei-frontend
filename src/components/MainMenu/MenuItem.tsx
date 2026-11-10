import {
  Badge,
  BottomNavigationAction,
  Button,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { NavLink, useMatch, useResolvedPath } from "react-router-dom";
import { MenuItemConfig } from "routes/menu";
import type { MenuOrientation } from ".";

interface MenuItemProps extends MenuItemConfig {
  orientation: MenuOrientation;
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

  if (orientation === "bottom") {
    return (
      <BottomNavigationAction
        component={NavLink}
        to={path}
        onClick={onClick}
        label={label}
        icon={iconWithBadge}
        showLabel
        sx={{
          flex: 1,
          minWidth: 0,
          px: 0.5,
          color: active ? "primary.main" : "text.secondary",
          "& .MuiBottomNavigationAction-label": {
            fontSize: "0.6875rem",
            fontWeight: active ? 700 : undefined,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
          },
        }}
      />
    );
  }

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
