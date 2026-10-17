import { ReactNode } from "react";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import siteMap from "./siteMap";

export interface MenuItemConfig {
  label: string;
  path: string;
  icon?: ReactNode;
}

/** Itens do menu principal (os mesmos para o menu vertical e o horizontal). */
const menuItems: MenuItemConfig[] = [
  { label: "Início", path: siteMap.protected.home, icon: <HomeIcon /> },
  {
    label: "Exemplo",
    path: siteMap.protected.example,
    icon: <AssignmentIcon />,
  },
];

export default menuItems;
