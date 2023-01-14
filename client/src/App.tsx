import { Fragment, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import "./App.css";
import { MoonIcon, SunIcon } from "./assets";
import Constants from "./utils/Constants";

const App = (): JSX.Element => {
  const [palette, setPalette] = useState<string>(Constants.DarkPalette);

  const togglePalette = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const newPalette =
      palette === Constants.LightPalette
        ? Constants.DarkPalette
        : Constants.LightPalette;
    document.body.className = newPalette;
    setPalette(newPalette);
  };

  const renderThemeIcon = (): JSX.Element => {
    if (palette === Constants.LightPalette) return <MoonIcon />;
    return <SunIcon />;
  };

  console.log(palette);
  return (
    <Fragment>
      <div className={`screen-container`}>
        <button className="toggleButton" onClick={togglePalette}>
          {renderThemeIcon()}
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
