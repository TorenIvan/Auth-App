import React, { FC } from "react";
import { Route, Routes  } from "react-router-dom";
import Register from "./components/Auth/Register/Register";
import Login from "./components/Auth/Login/Login";
import "./App.css"

const App: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
    </Routes>
  );
};

export default App;
