import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Register from "./components/Auth/Register/Register";
import Login from "./components/Auth/Login/Login";
import "./App.css";
import Constants from "./utils/Constants";

const App = (): JSX.Element => {
  const [palette, setPalette] = useState(Constants.LightPalette);

  const togglePalette = () => {
    const newPalette =
      palette === Constants.LightPalette
        ? Constants.DarkPalette
        : Constants.LightPalette;
    setPalette(newPalette);
  };

  const theme = `${palette}-theme`;
  return (
    <div className={theme}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
};

export default App;
