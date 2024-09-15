import React from "react";
import { Outlet } from "react-router-dom";
import Navigation_bar from "./Components/Navigation_bar";
import "../../CSS/User_Css/Layout.css";

const User_Layout = () => {
  return (
    <div>
      {/* <NavBar /> */}
      <div className="nav_bar_pos">
        <Navigation_bar />
      </div>
      <main>
        <Outlet />
      </main>
      {/* <Footer /> */}
      footer
    </div>
  );
};

export default User_Layout;
