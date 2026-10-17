import { formatRelative, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import React from "react";

interface FriendlyDateProps {
  date: string | Date;
}

const FriendlyDate: React.FC<FriendlyDateProps> = ({
  date,
}: FriendlyDateProps) => {
  const datastate = React.useMemo(() => {
    if (date) {
      const register = typeof date === "string" ? parseISO(date) : date;
      return formatRelative(register, new Date(), { locale: ptBR });
    } else {
      return "";
    }
  }, [date]);

  return <>{datastate}</>;
};

export default FriendlyDate;
