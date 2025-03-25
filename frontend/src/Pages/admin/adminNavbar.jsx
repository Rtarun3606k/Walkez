import React from "react";
import "../../CSS/User_Css/adminNavbar.css";

const AdminNavbar = () => {
  return (
    <div className="adminNav">
      <a href="/admin/home">
        <div className="navItems">
          <img src=".../public/logos/home.svg" alt="" />
          Home
        </div>
      </a>
      <a href="/admin/user">
        <div className="navItems">
          <img src=".../public/logos/usersnav.svg" alt="" />
          Users
        </div>
      </a>

      <a href="/admin/noti">
        <div className="navItems">
          <img src=".../public/logos/notification.svg" alt="" />
          Notifications
        </div>
      </a>
      <a href="/admin/images">
        <div className="navItems">
          <img src=".../public/logos/images.svg" alt="" />
          Images
        </div>
      </a>
    </div>
  );
};

export default AdminNavbar;
