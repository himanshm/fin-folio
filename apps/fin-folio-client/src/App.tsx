import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import { ThemeProvider } from "./contexts";
import router from "./routes";
import { store } from "./store/store";

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <RouterProvider router={router}></RouterProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
