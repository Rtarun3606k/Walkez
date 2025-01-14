import React from "react";
import { Outlet } from "react-router-dom";
import { useState } from "react";

import "../../CSS/User_Css/Layout.css";
import Footer from "./Components/Footer";
import NavigationBar from "./Components/Navigation_bar";

const User_Layout = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  return (
    <div className="">
      {/* <NavBar /> */}
      <div className="nav_bar_pos z-50">
        <NavigationBar
          isCollapsed={isNavCollapsed}
          onCollapse={setIsNavCollapsed}
        />
      </div>
      <main
        className={`${
          isNavCollapsed ? "collapsed  " : ""
        }  bg-red-400 -ml-[1%] p-0 w-[140%]`}
      >
        <Outlet />
      </main>
      {/* <Footer /> */}
      <Footer />
    </div>
  );
};

export default User_Layout;
