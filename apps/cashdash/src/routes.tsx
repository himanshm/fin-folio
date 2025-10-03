import { createBrowserRouter } from 'react-router';
import Home from './components/Home';
import DefaultLayout from './layouts/DefaultLayout';

const router = createBrowserRouter([
  {
    Component: DefaultLayout,
    children: [
      {
        index: true,
        Component: Home
      }
    ]
  }
]);

export default router;
