import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiGlobalProvider } from "jotai";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import Layout from "./layouts";
import indexRouter from "./routes";

const queryClient = new QueryClient();

const App = (): JSX.Element => {
  return (
    <JotaiGlobalProvider>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <RouterProvider router={indexRouter} />
        </Layout>
      </QueryClientProvider>
    </JotaiGlobalProvider>
  );
};

export default App;
