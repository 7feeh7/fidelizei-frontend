import siteMap from "./siteMap";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Login from "pages/Login";
import UnProtectedMiddleware from "middlewares/UnProtectedRoutes";
import ProtectedMiddleware from "middlewares/ProtectedRoutes";
import UnauthorizedHandler from "middlewares/UnauthorizedHandler";
import { useAuth } from "contexts/AuthContext";
import { TAB_PARAM } from "hooks/useTabParam";
import ConfirmCode from "pages/ConfirmCode";
import RequestNewPassword from "pages/RequestNewPassword";
import ResetPassword from "pages/ResetPassword";
import Home from "pages/Home";
import CustomersArea from "pages/CustomersArea";
import CustomerProfile from "pages/CustomerProfile";
import Appointments from "pages/Appointments";
import AppointmentForm from "pages/AppointmentForm";
import MessagesArea from "pages/MessagesArea";
import BusinessArea from "pages/BusinessArea";
import Profile from "pages/Profile";

function CatchAllRedirect() {
  const { isAuthenticated } = useAuth();

  return (
    <Navigate
      to={isAuthenticated ? siteMap.protected.home : siteMap.auth.login}
      replace
    />
  );
}

/** rota antiga -> tela nova (com a aba correspondente, quando houver) */
const legacyRedirects: { from: string; to: string; tab?: string }[] = [
  {
    from: siteMap.legacy.monthlyBirthdays,
    to: siteMap.protected.customers,
    tab: "aniversariantes",
  },
  {
    from: siteMap.legacy.referrals,
    to: siteMap.protected.customers,
    tab: "indicacoes",
  },
  { from: siteMap.legacy.dailyMessages, to: siteMap.protected.messages },
  {
    from: siteMap.legacy.messageTemplates,
    to: siteMap.protected.messages,
    tab: "modelos",
  },
  { from: siteMap.legacy.services, to: siteMap.protected.business },
  {
    from: siteMap.legacy.loyaltyRules,
    to: siteMap.protected.business,
    tab: "fidelidade",
  },
];

export default function Router() {
  return (
    <BrowserRouter>
      <UnauthorizedHandler />
      <Routes>
        <Route element={<UnProtectedMiddleware />}>
          <Route path={siteMap.auth.login} element={<Login />} />
          <Route path={siteMap.auth.confirmCode} element={<ConfirmCode />} />
          <Route
            path={siteMap.auth.requestNewPassword}
            element={<RequestNewPassword />}
          />
          <Route path={siteMap.auth.newPassword} element={<ResetPassword />} />
        </Route>
        <Route element={<ProtectedMiddleware />}>
          <Route path={siteMap.protected.home} element={<Home />} />
          <Route
            path={siteMap.protected.customers}
            element={<CustomersArea />}
          />
          <Route
            path={siteMap.protected.customerProfile}
            element={<CustomerProfile />}
          />
          <Route
            path={siteMap.protected.appointments}
            element={<Appointments />}
          />
          <Route
            path={siteMap.protected.newAppointment}
            element={<AppointmentForm />}
          />
          <Route
            path={`${siteMap.protected.appointments}/:id`}
            element={<AppointmentForm />}
          />
          <Route path={siteMap.protected.messages} element={<MessagesArea />} />
          <Route path={siteMap.protected.business} element={<BusinessArea />} />
          <Route path={siteMap.protected.profile} element={<Profile />} />
          {legacyRedirects.map(({ from, to, tab }) => (
            <Route
              key={from}
              path={from}
              element={
                <Navigate
                  to={tab ? `${to}?${TAB_PARAM}=${tab}` : to}
                  replace
                />
              }
            />
          ))}
        </Route>
        <Route path="*" element={<CatchAllRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
