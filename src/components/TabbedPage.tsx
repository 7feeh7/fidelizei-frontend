import { Fragment, ReactNode } from "react";
import { Stack, Tab, Tabs, Typography } from "@mui/material";
import { useTabParam } from "hooks/useTabParam";

export interface TabbedPageTab<T extends string> {
  /** valor usado na URL (?aba=valor) */
  value: T;
  label: ReactNode;
  content: ReactNode;
}

interface TabbedPageProps<T extends string> {
  title: string;
  /** a primeira aba é a padrão */
  tabs: TabbedPageTab<T>[];
}

/** Tela com título e abas; a aba ativa fica na URL. */
function TabbedPage<T extends string>({ title, tabs }: TabbedPageProps<T>) {
  const [tab, setTab] = useTabParam(tabs.map((item) => item.value));
  const current = tabs.find((item) => item.value === tab) ?? tabs[0];

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h5" fontWeight={700}>
          {title}
        </Typography>
        <Tabs
          value={current.value}
          onChange={(_, value) => setTab(value as T)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          {tabs.map((item) => (
            <Tab key={item.value} value={item.value} label={item.label} />
          ))}
        </Tabs>
      </Stack>

      {/* key: cada aba começa com estado limpo (filtros, diálogos abertos) */}
      <Fragment key={current.value}>{current.content}</Fragment>
    </Stack>
  );
}

export default TabbedPage;
