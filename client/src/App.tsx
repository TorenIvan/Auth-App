import { RouterProvider } from "react-router-dom";
import "./App.css";
import { ErrorBoundary } from "./components";
import Layout from "./layouts";
import indexRouter from "./routes";

const App = (): JSX.Element => {
  return (
    <ErrorBoundary>
      <Layout>
        <RouterProvider router={indexRouter} />
      </Layout>
    </ErrorBoundary>
  );
};

export default App;
