import { ReactNode } from "react";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ChatIcon from "@mui/icons-material/Chat";
import StorefrontIcon from "@mui/icons-material/Storefront";
import siteMap from "./siteMap";

export interface MenuItemConfig {
  label: string;
  path: string;
  icon?: ReactNode;
  showPendingMessagesBadge?: boolean;
}

/**
 * Itens do menu principal (os mesmos para o menu lateral, o horizontal e a barra inferior do mobile).
 * Ordem por frequência de uso.
 */
const menuItems: MenuItemConfig[] = [
  { label: "Início", path: siteMap.protected.home, icon: <HomeIcon /> },
  {
    label: "Atendimentos",
    path: siteMap.protected.appointments,
    icon: <EventAvailableIcon />,
  },
  {
    label: "Clientes",
    path: siteMap.protected.customers,
    icon: <PeopleIcon />,
  },
  {
    label: "Mensagens",
    path: siteMap.protected.messages,
    icon: <ChatIcon />,
    showPendingMessagesBadge: true,
  },
  {
    label: "Meu negócio",
    path: siteMap.protected.business,
    icon: <StorefrontIcon />,
  },
];

export default menuItems;
