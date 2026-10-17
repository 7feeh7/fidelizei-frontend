import { ReactNode } from "react";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
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
    label: "Clientes",
    path: siteMap.protected.customers,
    icon: <PeopleIcon />,
  },
  {
    label: "Serviços",
    path: siteMap.protected.services,
    icon: <DesignServicesIcon />,
  },
];

export default menuItems;
