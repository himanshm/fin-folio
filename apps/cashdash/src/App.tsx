import { AppProvider } from '@/contexts/AppContext';
import { RouterProvider } from 'react-router/dom';
import router from './routes';

const App = () => {
  return (
    <AppProvider defaultTheme="system" storageKey="app-theme">
      <RouterProvider router={router} />
    </AppProvider>
  );
};

export default App;
