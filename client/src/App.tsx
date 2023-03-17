import { RouterProvider } from "react-router-dom";
import { ThemeIcon } from "./icons";
import { useTheme } from "./hooks";
import Constants from "./utils/Constants";
import "./App.css";
import Layout from "./layouts";
import indexRouter from "./routes";

const App = (): JSX.Element => {
  const [theme, toggleTheme] = useTheme(Constants.LightPalette);

  const handleThemeIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    toggleTheme();
  };

  return (
    <Layout>
      <button className="toggleButton" onClick={handleThemeIconClick}>
        <ThemeIcon theme={theme} />
      </button>
      <RouterProvider router={indexRouter} />
    </Layout>
  );
};

export default App;
