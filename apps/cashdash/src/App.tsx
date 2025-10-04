import { AppProvider } from '@/contexts/AppContext';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router/dom';
import router from './routes';
import { store } from './store/store';

const App = () => {
  return (
    <Provider store={store}>
      <AppProvider defaultTheme="system" storageKey="app-theme">
        <RouterProvider router={router} />
      </AppProvider>
    </Provider>
  );
};

export default App;
