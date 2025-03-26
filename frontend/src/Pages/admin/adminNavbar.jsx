import React from "react";
import "../../CSS/User_Css/adminNavbar.css";
import { NavLink } from "react-router-dom";

const AdminNavbar = () => {
  return (
    <div className="adminNav">
      <NavLink to={"/admin/home"}>
        <div className="navItems">
          <img src=".../public/logos/home.svg" alt="" />
          Home
        </div>
      </NavLink>
      <NavLink to={"/admin/user"}>
        <div className="navItems">
          <img src=".../public/logos/usersnav.svg" alt="" />
          Users
        </div>
      </NavLink>

      <NavLink to={"/admin/noti"}>
        <div className="navItems">
          <img src=".../public/logos/notification.svg" alt="" />
          Notifications
        </div>
      </NavLink>
      <NavLink to={"/admin/images"}>
        <div className="navItems">
          <img src=".../public/logos/images.svg" alt="" />
          Images
        </div>
      </NavLink>
    </div>
  );
};

export default AdminNavbar;
