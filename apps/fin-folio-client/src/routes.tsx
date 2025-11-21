import { createBrowserRouter } from "react-router";
import RouteGuard from "./components/routes/RouteGuard";
import DefaultLayout from "./layouts/DefaultLayout";
import Budgets from "./pages/Budgets";
import Dashboard from "./pages/Dashboard";
import Investments from "./pages/Investments";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Transactions from "./pages/Transactions";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import UpdatePassword from "./pages/auth/UpdatePassword";

const router = createBrowserRouter([
  {
    Component: DefaultLayout,
    children: [
      {
        element: <RouteGuard requiredAuth={true} redirectTo="/login" />,
        children: [
          { index: true, Component: Dashboard },
          { path: "dashboard", Component: Dashboard },
          { path: "transactions", Component: Transactions },
          { path: "budgets", Component: Budgets },
          { path: "investments", Component: Investments },
          { path: "reports", Component: Reports },
          { path: "settings", Component: Settings },
          { path: "update-password", Component: UpdatePassword }
        ]
      },
      {
        element: <RouteGuard requiredAuth={false} redirectTo="/" />,
        children: [
          { path: "login", Component: Login },
          { path: "register", Component: Register },
          { path: "forgot-password", Component: ForgotPassword },
          { path: "reset-password", Component: ResetPassword }
        ]
      }
    ]
  }
]);

export default router;
