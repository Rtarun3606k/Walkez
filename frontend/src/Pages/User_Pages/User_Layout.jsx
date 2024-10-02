import React from "react";
import { Outlet } from "react-router-dom";
import Navigation_bar from "./Components/Navigation_bar";
import "../../CSS/User_Css/Layout.css";
import Footer from "./Components/Footer";

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
      <Footer />
    </div>
  );
};
// d24e2bbe899f9aa7efa00d5fed297af8
export default User_Layout;
