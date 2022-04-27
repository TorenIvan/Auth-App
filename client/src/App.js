import React from "react";
import { Route, Routes  } from "react-router-dom";
import Register from "./components/Auth/Register/Register";
import Login from "./components/Auth/Login/Login";
import "./App.css"

const App = () => {
  return (
    <Routes>
      <Route exact path={"/"} element={<Login/>} />
      <Route exact path={"/login"} element={<Login/>} />
      <Route exact path={"/register"} element={<Register/>} />
    </Routes>
  );
};

export default App;
