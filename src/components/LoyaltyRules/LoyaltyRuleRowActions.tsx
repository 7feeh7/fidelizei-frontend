import { useState } from "react";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import { LoyaltyRuleListItem } from "interfaces/loyaltyRules";

interface LoyaltyRuleRowActionsProps {
  rule: LoyaltyRuleListItem;
  onEdit: (rule: LoyaltyRuleListItem) => void;
  onToggleActive: (rule: LoyaltyRuleListItem) => void;
}

function LoyaltyRuleRowActions({
  rule,
  onEdit,
  onToggleActive,
}: LoyaltyRuleRowActionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <IconButton
        aria-label="Ações da regra"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        size="small"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose();
            onEdit(rule);
          }}
        >
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            onToggleActive(rule);
          }}
        >
          <ListItemIcon>
            {rule.active ? (
              <ToggleOffOutlinedIcon fontSize="small" />
            ) : (
              <ToggleOnOutlinedIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>{rule.active ? "Inativar" : "Ativar"}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

export default LoyaltyRuleRowActions;
