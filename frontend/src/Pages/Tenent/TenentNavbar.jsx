import React from "react";
import "../../CSS/User_Css/adminNavbar.css";
import { NavLink } from "react-router-dom";

const TenentNav = () => {
  return (
    <div className="adminNav">
      <NavLink to={"/tenent/home"}>
        <div className="navItems">
          <img src=".../public/logos/home.svg" alt="" />
          Home
        </div>
      </NavLink>
      <NavLink to={"/tenent/user"}>
        <div className="navItems">
          <img src=".../public/logos/usersnav.svg" alt="" />
          Users
        </div>
      </NavLink>

      <NavLink to={"/tenent/noti"}>
        <div className="navItems">
          <img src=".../public/logos/notification.svg" alt="" />
          Notifications
        </div>
      </NavLink>
      <NavLink to={"/tenent/images"}>
        <div className="navItems">
          <img src=".../public/logos/images.svg" alt="" />
          Images
        </div>
      </NavLink>
    </div>
  );
};

export default TenentNav;
