export default {
  auth: {
    login: "/auth/login",
    confirmCode: "/auth/codigo-de-confirmacao",
    requestNewPassword: "/auth/request-new-password",
    newPassword: "/auth/new-password",
  },
  protected: {
    home: "/",
    example: "/exemplo",
    /** abas: todos | aniversariantes | indicacoes */
    customers: "/clientes",
    customerProfile: "/clientes/:customerId",
    appointments: "/atendimentos",
    newAppointment: "/atendimentos/novo",
    /** abas: para-enviar | enviadas | descartadas | modelos */
    messages: "/mensagens",
    /** abas: servicos | fidelidade */
    business: "/meu-negocio",
    profile: "/perfil",
  },
  /** rotas antigas, mantidas só para redirecionar links salvos para a aba nova */
  legacy: {
    services: "/servicos",
    referrals: "/indicacoes",
    loyaltyRules: "/regras-de-fidelidade",
    messageTemplates: "/modelos-de-mensagem",
    dailyMessages: "/mensagens-do-dia",
    monthlyBirthdays: "/aniversariantes",
  },
};
