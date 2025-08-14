import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Toast from "./components/Toast";
import "./App.css";
import { AppWithAxiosSetup } from "./AppWithAxiosSetup";
import { AuthProvider, ThemeProvider } from "./store";
import { queryClient } from "./config";

const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppWithAxiosSetup />
          <Toast />
        </AuthProvider>
      </ThemeProvider>
      {import.meta.env.VITE_NODE_ENV === 'development' ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ): undefined}
    </QueryClientProvider>
  );
};

export default App;
