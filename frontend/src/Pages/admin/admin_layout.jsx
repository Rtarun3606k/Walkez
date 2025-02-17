import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./adminNavbar";

const Admin_layout = () => {
  return (
    <div>
      <AdminNavbar />
      <Outlet />
    </div>
  );
};

export default Admin_layout;
