import { ReactNode } from "react";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ShareIcon from "@mui/icons-material/Share";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import MarkChatUnreadIcon from "@mui/icons-material/MarkChatUnread";
import siteMap from "./siteMap";

export interface MenuItemConfig {
  label: string;
  path: string;
  icon?: ReactNode;
  showPendingMessagesBadge?: boolean;
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
  {
    label: "Mensagens do dia",
    path: siteMap.protected.dailyMessages,
    icon: <MarkChatUnreadIcon />,
    showPendingMessagesBadge: true,
  },
  {
    label: "Modelos de mensagem",
    path: siteMap.protected.messageTemplates,
    icon: <ChatOutlinedIcon />,
  },
];

export default menuItems;
