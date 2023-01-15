import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import "./App.css";
import Constants from "./utils/Constants";
import { useTheme } from "./hooks";
import ThemeIcon from "./components/Icons/ThemeIcon";

const App = (): JSX.Element => {
  const [theme, toggleTheme] = useTheme(Constants.LightPalette);

  const handleThemeIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    toggleTheme();
  };

  return (
    <Fragment>
      <div className={`screen-container`}>
        <button className="toggleButton" onClick={handleThemeIconClick}>
          <ThemeIcon theme={theme} />
        </button>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Fragment>
  );
};

export default App;
