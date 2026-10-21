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
import { ServiceListItem } from "interfaces/services";

interface ServiceRowActionsProps {
  service: ServiceListItem;
  onEdit: (service: ServiceListItem) => void;
}

function ServiceRowActions({ service, onEdit }: ServiceRowActionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <IconButton
        aria-label="Ações do serviço"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        size="small"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose();
            onEdit(service);
          }}
        >
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

export default ServiceRowActions;
