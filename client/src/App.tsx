import { RouterProvider } from "react-router-dom";
import "./App.css";
import Layout from "./layouts";
import indexRouter from "./routes";

const App = (): JSX.Element => {
  return (
    <Layout>
      <RouterProvider router={indexRouter} />
    </Layout>
  );
};

export default App;
