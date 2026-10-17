/**
 * Configuração central do produto.
 * Troque os valores abaixo para adaptar o boilerplate sem mexer nos componentes.
 * Cores ficam em `theme/colors.ts` e os itens do menu em `routes/menu.tsx`.
 */
import { ContainerProps } from "@mui/material/Container";

/** "centered": card no centro da tela | "split": logo de um lado e formulário do outro */
export type AuthLayout = "centered" | "split";

/** Lado do formulário quando o layout de login é "split" (a logo fica no lado oposto) */
export type AuthFormSide = "left" | "right";

/** "vertical": menu lateral | "horizontal": menu na barra superior */
export type MenuLayout = "vertical" | "horizontal";

export interface AppConfig {
  name: string;
  logo: {
    /** logo grande, usada nas telas de login */
    full: string;
    /** logo compacta, usada na barra superior */
    compact: string;
  };
  auth: {
    layout: AuthLayout;
    formSide: AuthFormSide;
  };
  menu: {
    layout: MenuLayout;
    /** largura do menu vertical, em px */
    width: number;
  };
  content: {
    /** largura máxima do conteúdo das páginas logadas */
    maxWidth: ContainerProps["maxWidth"];
  };
}

const appConfig: AppConfig = {
  name: "Fidelizei",
  logo: {
    full: "/logo.svg",
    compact: "/logo-min.svg",
  },
  auth: {
    layout: "split",
    formSide: "right",
  },
  menu: {
    layout: "vertical",
    width: 240,
  },
  content: {
    maxWidth: "lg",
  },
};

export default appConfig;
