import TabbedPage from "components/TabbedPage";
import Customers from "pages/Customers";
import MonthlyBirthdays from "pages/MonthlyBirthdays";
import Referrals from "pages/Referrals";

/** Clientes: lista de clientes, aniversariantes do mês e indicações. */
function CustomersArea() {
  return (
    <TabbedPage
      title="Clientes"
      tabs={[
        { value: "todos", label: "Todos", content: <Customers /> },
        {
          value: "aniversariantes",
          label: "Aniversariantes",
          content: <MonthlyBirthdays />,
        },
        { value: "indicacoes", label: "Indicações", content: <Referrals /> },
      ]}
    />
  );
}

export default CustomersArea;
