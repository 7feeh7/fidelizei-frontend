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
import { MessageTemplateListItem } from "interfaces/messageTemplates";

interface MessageTemplateRowActionsProps {
  template: MessageTemplateListItem;
  onEdit: (template: MessageTemplateListItem) => void;
  onToggleActive: (template: MessageTemplateListItem) => void;
}

function MessageTemplateRowActions({
  template,
  onEdit,
  onToggleActive,
}: MessageTemplateRowActionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <IconButton
        aria-label="Ações do modelo"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        size="small"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose();
            onEdit(template);
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
            onToggleActive(template);
          }}
        >
          <ListItemIcon>
            {template.active ? (
              <ToggleOffOutlinedIcon fontSize="small" />
            ) : (
              <ToggleOnOutlinedIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {template.active ? "Inativar" : "Ativar"}
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

export default MessageTemplateRowActions;
