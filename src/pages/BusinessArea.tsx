import TabbedPage from "components/TabbedPage";
import LoyaltyRules from "pages/LoyaltyRules";
import Services from "pages/Services";

/** Meu negócio: configurações (serviços e regras de fidelidade). */
function BusinessArea() {
  return (
    <TabbedPage
      title="Meu negócio"
      tabs={[
        { value: "servicos", label: "Serviços", content: <Services /> },
        {
          value: "fidelidade",
          label: "Regras de fidelidade",
          content: <LoyaltyRules />,
        },
      ]}
    />
  );
}

export default BusinessArea;
