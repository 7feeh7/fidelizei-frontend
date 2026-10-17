import siteMap from "./siteMap";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Login from "pages/Login";
import UnProtectedMiddleware from "middlewares/UnProtectedRoutes";
import ProtectedMiddleware from "middlewares/ProtectedRoutes";
import ConfirmCode from "pages/ConfirmCode";
import RequestNewPassword from "pages/RequestNewPassword";
import ResetPassword from "pages/ResetPassword";
import Home from "pages/Home";
import Customers from "pages/Customers";
import Services from "pages/Services";
import Appointments from "pages/Appointments";
import AppointmentForm from "pages/AppointmentForm";
import Referrals from "pages/Referrals";
import LoyaltyRules from "pages/LoyaltyRules";
import MessageTemplates from "pages/MessageTemplates";
import DailyMessages from "pages/DailyMessages";

export default function Router() {
  return (
    <BrowserRouter>
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
          <Route path={siteMap.protected.customers} element={<Customers />} />
          <Route path={siteMap.protected.services} element={<Services />} />
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
          <Route path={siteMap.protected.referrals} element={<Referrals />} />
          <Route
            path={siteMap.protected.loyaltyRules}
            element={<LoyaltyRules />}
          />
          <Route
            path={siteMap.protected.messageTemplates}
            element={<MessageTemplates />}
          />
          <Route
            path={siteMap.protected.dailyMessages}
            element={<DailyMessages />}
          />
        </Route>
        <Route
          path="*"
          element={<Navigate to={siteMap.protected.home} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
