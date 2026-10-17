import { ReactNode } from "react";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ShareIcon from "@mui/icons-material/Share";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
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
  {
    label: "Atendimentos",
    path: siteMap.protected.appointments,
    icon: <EventAvailableIcon />,
  },
  {
    label: "Indicações",
    path: siteMap.protected.referrals,
    icon: <ShareIcon />,
  },
  {
    label: "Fidelidade",
    path: siteMap.protected.loyaltyRules,
    icon: <LoyaltyIcon />,
  },
];

export default menuItems;
