import React from "react";
import "../../CSS/User_Css/adminNavbar.css";

const AdminNavbar = () => {
  return (
    <div className="adminNav">
      <div className="navItems">
        <img src=".../public/logos/home.svg" alt="" />
        Home
      </div>
      <div className="navItems">
        <img src=".../public/logos/usersnav.svg" alt="" />
        Users
      </div>
      <div className="navItems">
        <img src=".../public/logos/profilenav.svg" alt="" />
        Profile
      </div>
      <div className="navItems">
        <img src=".../public/logos/notification.svg" alt="" />
        Notifications
      </div>
      <div className="navItems">
        <img src=".../public/logos/images.svg" alt="" />
        Images
      </div>
      <div className="navItems">
        <img src=".../public/logos/questionmark.svg" alt="" />
      </div>
    </div>
  );
};

export default AdminNavbar;
