import { createBrowserRouter } from "react-router";
import RouteGuard from "./components/routes/RouteGuard";
import DefaultLayout from "./layouts/DefaultLayout";
import Dashboard from "./pages/Dashboard";

const router = createBrowserRouter([
  {
    Component: DefaultLayout,
    children: [
      {
        element: <RouteGuard requiredAuth={true} redirectTo="/login" />,
        children: [{ index: true, Component: Dashboard }]
      }
    ]
  }
]);

export default router;
