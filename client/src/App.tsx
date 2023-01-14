import { Fragment, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./components/Auth/Register/Register";
import Login from "./components/Auth/Login/Login";
import "./App.css";
import Constants from "./utils/Constants";
import { MoonIcon, SunIcon } from "./assets";

const App = (): JSX.Element => {
  const [palette, setPalette] = useState(Constants.DarkPalette);

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
