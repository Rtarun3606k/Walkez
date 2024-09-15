import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import User_Layout from "./Pages/User_Pages/User_Layout";
import User_Home from "./Pages/User_Pages/User_Home";
import User_Login from "./Pages/User_Pages/User_Login";
import User_Register from "./Pages/User_Pages/User_Register";

const APPRouter = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<User_Layout />}>
            <Route index element={<User_Home />} />
            <Route path="/login" element={<User_Login />} />
            <Route path="/register" element={<User_Register />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default APPRouter;
