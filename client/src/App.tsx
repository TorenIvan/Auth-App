import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./components/Auth/Register/Register";
import Login from "./components/Auth/Login/Login";
import "./App.css";
import Constants from "./utils/Constants";
import { MoonIcon, SunIcon } from "./assets";

const App = (): JSX.Element => {
  const [palette, setPalette] = useState(Constants.LightPalette);
  useEffect(() => {
    console.log(palette);
  }, [palette]);

  const togglePalette = () => {
    const newPalette =
      palette === Constants.LightPalette
        ? Constants.DarkPalette
        : Constants.LightPalette;
    setPalette(newPalette);
  };

  const renderThemeIcon = (): JSX.Element => {
    if (palette === Constants.LightPalette) return <SunIcon />;
    return <MoonIcon />;
  };

  return (
    <div className="screen-container" data-theme={palette}>
      <button onClick={togglePalette}>{renderThemeIcon()}</button>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
};

export default App;
