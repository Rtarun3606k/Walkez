import React from "react";
import { Outlet } from "react-router-dom";
import { useState } from 'react';

import "../../CSS/User_Css/Layout.css";
import Footer from "./Components/Footer";
import NavigationBar from "./Components/Navigation_bar";

const User_Layout = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  return (
    <div>
      {/* <NavBar /> */}
      <div className="nav_bar_pos">
      <NavigationBar
        isCollapsed={isNavCollapsed} 
        onCollapse={setIsNavCollapsed} 
      />
      </div>
      <main className={isNavCollapsed ? 'collapsed' : ''}>
        <Outlet />
      </main>
      {/* <Footer /> */}
      <Footer />
    </div>
  );
};
// d24e2bbe899f9aa7efa00d5fed297af8
export default User_Layout;
