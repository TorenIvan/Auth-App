import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider as JotaiGlobalProvider } from "jotai";
import { RouterProvider } from "react-router-dom";
import Toast from "./components/Toast";
import indexRouter from "./routes";
import "./App.css";

export const globalQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
      cacheTime: Infinity,
    },
  },
});

const App = (): JSX.Element => {
  return (
    <JotaiGlobalProvider>
      <QueryClientProvider client={globalQueryClient}>
        <div className="screen-container">
          <RouterProvider router={indexRouter(globalQueryClient)} />
        </div>
        <Toast />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </JotaiGlobalProvider>
  );
};

export default App;
