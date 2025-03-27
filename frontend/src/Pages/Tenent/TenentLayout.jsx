import React from "react";
import { Outlet } from "react-router-dom";
import TenentNav from "./TenentNavbar";

const TenentLayout = () => {
  return (
    <div>
      <TenentNav />
      <Outlet />
    </div>
  );
};

export default TenentLayout;
