import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import User_Layout from "./Pages/User_Pages/User_Layout";
import User_Home from "./Pages/User_Pages/User_Home";
import User_Login from "./Pages/User_Pages/User_Login";
import User_Register from "./Pages/User_Pages/User_Register";
import User_upload from "./Pages/User_Pages/User_upload";
import User_profile from "./Pages/User_Pages/User_profile";
import User_layout2 from "./Pages/User_Pages/User_layout2";
import User_about from "./Pages/User_Pages/User_about";
import User_services from "./Pages/User_Pages/User_services";
import Admin_layout from "./Pages/admin/admin_layout";
import AdminHomePage from "./Pages/admin/adminHomePage";

const APPRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<User_Layout />}>
          <Route index element={<User_Home />} />
          <Route path="login" element={<User_Login />} />
          <Route path="register" element={<User_Register />} />
        </Route>
        <Route path="/user" element={<User_layout2 />}>
          <Route index element={<User_Home />} />
          <Route path="upload" element={<User_upload />} />
          <Route path="profile" element={<User_profile />} />
          <Route path="about" element={<User_about />} />
          <Route path="service" element={<User_services />} />
        </Route>
        <Route path="/admin" element={<Admin_layout />}>
          <Route index element={<AdminHomePage />} />
        </Route>
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default APPRouter;
