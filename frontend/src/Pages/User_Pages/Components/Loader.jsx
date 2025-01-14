import React from "react";
import { MoonLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="w-[80%] h-full   justify-center items-center flex mr-[20%] ">
      <MoonLoader />
    </div>
  );
};

export default Loader;
