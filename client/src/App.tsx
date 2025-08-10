import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider as JotaiGlobalProvider } from "jotai";
import Toast from "./components/Toast";
import "./App.css";
import { AppWithAxiosSetup } from "./AppWithAxiosSetup";
import { AuthProvider } from "./store";

export const globalQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 120000,
    },
  },
});

const App = (): JSX.Element => {
  return (
    <JotaiGlobalProvider>
      <QueryClientProvider client={globalQueryClient}>
        <AuthProvider>
          <AppWithAxiosSetup globalQueryClient={globalQueryClient}/>
          <Toast />
        </AuthProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </JotaiGlobalProvider>
  );
};

export default App;
