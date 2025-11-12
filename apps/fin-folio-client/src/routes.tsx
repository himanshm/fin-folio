import { createBrowserRouter } from "react-router";
import RouteGuard from "./components/routes/RouteGuard";
import DefaultLayout from "./layouts/DefaultLayout";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";

const router = createBrowserRouter([
  {
    Component: DefaultLayout,
    children: [
      {
        element: <RouteGuard requiredAuth={true} redirectTo="/login" />,
        children: [
          { index: true, Component: Dashboard },
          { path: "dashboard", Component: Dashboard }
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
