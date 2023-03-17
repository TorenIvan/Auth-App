import { Route, Routes } from "react-router-dom";
import { Register, Login } from "./pages";
import { ThemeIcon } from "./icons";
import { useTheme } from "./hooks";
import Constants from "./utils/Constants";
import "./App.css";
import Layout from "./layouts";

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
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Layout>
  );
};

export default App;
