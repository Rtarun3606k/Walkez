import React, { useRef, useState } from "react";
import "../../../CSS/User_Css/Nav.css";
import { Link } from "react-router-dom";

const Navigation_bar = () => {
  const [cross_click, setCross_click] = useState(false);
  const navbar = useRef(null);
  const up = useRef(null);
  const logo = useRef(null);
  const search = useRef(null);
  const company_name = useRef(null);

  // Array of headings and icons
  const headings = [
    { icon: "./logos/home.png", text: "Home", a: "/" },
    { icon: "./logos/about.png", text: "About", a: "/about" },
    { icon: "./logos/sevices.png", text: "Services", a: "/services" },
    { icon: "./logos/contact.png", text: "Contact", a: "/conatct" },
  ];

  const change_dimension = () => {
    cross_click
      ? ((navbar.current.style.width = "13vw"),
        up.current.classList.remove("up_squezed"),
        // search.current.classList.remove("hide"),
        company_name.current.classList.remove("hide"))
      : ((navbar.current.style.width = "5vw"),
        up.current.classList.add("up_squezed"),
        // search.current.classList.add("hide"),
        company_name.current.classList.add("hide"));

    setCross_click(!cross_click);
  };

  return (
    <div className="center_nav">
      <div className="navbar" ref={navbar}>
        <div className="one ">
          <div className="up" ref={up}>
            <div className="logo" ref={logo}>
              <a href="" className="a flex" ref={company_name}>
                WALK-EZ
              </a>
              <img
                src="./logos/logo.svg"
                alt=""
                className="flex company_logo"
              />
            </div>
            <div className="cross" onClick={change_dimension}>
              <img
                src={cross_click ? `./logos/ham.svg` : `./logos/cross.svg`}
                alt=""
              />
            </div>
          </div>

          <div className="middle">
            {/* Loop through headings array */}
            {headings.map((item, index) => (
              <Link to={item.a}>
                <div className="text_icon" key={index}>
                  <img src={item.icon} alt="" className="logos_heading" />
                  <h3 className={`nav_heading ${cross_click ? "hide" : ""}`}>
                    {item.text}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="login_logout">
          <Link to="/login">
            <button className="login_logout_btns">
              <img src="./logos/login.png" alt="" />
              {cross_click ? "" : <h3>Login</h3>}
            </button>
          </Link>

          <button className="login_logout_btns">
            <img src="./logos/logout.png" alt="" />
            {cross_click ? "" : <h3>Logout</h3>}
            {/* <h3>Logout</h3> */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navigation_bar;
