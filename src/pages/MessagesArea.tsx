import { useQuery } from "react-query";
import TabbedPage from "components/TabbedPage";
import DailyMessages from "pages/DailyMessages";
import MessageTemplates from "pages/MessageTemplates";
import { messageServices } from "services/messages";

/** Mensagens: fila do dia (para enviar, enviadas, descartadas) e modelos de mensagem. */
function MessagesArea() {
  // mesma query do badge do menu (compartilha cache)
  const { data: pendingCountData } = useQuery(
    ["messages-pending-count"],
    () => messageServices.pendingCount(),
    { refetchInterval: 60_000 }
  );
  const pendingCount = pendingCountData?.pendingCount ?? 0;

  return (
    <TabbedPage
      title="Mensagens"
      tabs={[
        {
          value: "para-enviar",
          label:
            pendingCount > 0 ? `Para enviar (${pendingCount})` : "Para enviar",
          content: <DailyMessages view="pending" />,
        },
        {
          value: "enviadas",
          label: "Enviadas",
          content: <DailyMessages view="sent" />,
        },
        {
          value: "descartadas",
          label: "Descartadas",
          content: <DailyMessages view="canceled" />,
        },
        { value: "modelos", label: "Modelos", content: <MessageTemplates /> },
      ]}
    />
  );
}

export default MessagesArea;
