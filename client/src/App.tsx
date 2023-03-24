import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import Layout from "./layouts";
import indexRouter from "./routes";

const queryClient = new QueryClient();

const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <RouterProvider router={indexRouter} />
      </Layout>
    </QueryClientProvider>
  );
};

export default App;
