import React from "react";
import { Outlet } from "react-router-dom";

const TenentLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default TenentLayout;
