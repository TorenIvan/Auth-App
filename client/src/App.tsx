import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider as JotaiGlobalProvider } from "jotai";
import Toast from "./components/Toast";
import "./App.css";
import { AppWithAxiosSetup } from "./AppWithAxiosSetup";
import { AuthProvider } from "./store";
import { queryClient } from "./config";

const App = (): JSX.Element => {
  return (
    <JotaiGlobalProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppWithAxiosSetup />
          <Toast />
        </AuthProvider>
        {import.meta.env.VITE_NODE_ENV === 'development' ? (
          <ReactQueryDevtools initialIsOpen={false} />
        ): undefined}
      </QueryClientProvider>
    </JotaiGlobalProvider>
  );
};

export default App;
