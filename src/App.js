import React from "react";
import { Route, Routes  } from "react-router-dom";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import "./App.css"

const App = () => {
  return (
    <Routes>
      <Route exact path={"/register"} element={<Register/>} />
      <Route exact path={"/login"} element={<Login/>} />
    </Routes>
  );
};

export default App;
