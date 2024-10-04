import React, { useEffect, useRef, useState } from "react";
import "../../../CSS/User_Css/Nav.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { check_token } from "../../../Utility/Cookies_validator";
import { delete_cookies_storedata } from "../../../Utility/Auth";

const Navigation_bar = () => {
  const navigate = useNavigate();
  const [cross_click, setCross_click] = useState(false);
  const navbar = useRef(null);
  const up = useRef(null);
  const logo = useRef(null);
  const company_name = useRef(null);
  const [login_button, setLogin_button] = useState(true);

  const check_session = async () => {
    const check = await check_token();
    if (check === false) {
      navigate("/login");
    }
    return check;
  };

  useEffect(() => {
    if (check_session === false) {
      navigate("/login");
    }
    setLogin_button(!check_token());
  }, []);

  const headings = [
    { icon: "../logos/home.png", text: "Home", a: "/" },
    { icon: "../logos/about.png", text: "About", a: "/user/about" },
    { icon: "../logos/sevices.png", text: "Services ", a: "/user/service" },
    { icon: "../logos/contact.png", text: "Contact", a: "/user/contact" },
    // { icon: "./logos/profile.svg", text: "Contact", a: "/profile" },
  ];

  const change_dimension = () => {
    if (cross_click) {
      navbar.current.style.width = "13vw";
      up.current.classList.remove("up_squezed");
      company_name.current.classList.remove("hide");
    } else {
      navbar.current.style.width = "5vw";
      up.current.classList.add("up_squezed");
      company_name.current.classList.add("hide");
    }
    setCross_click(!cross_click);
  };

  const logout = () => {
    delete_cookies_storedata();
    setLogin_button(true);
    navigate("/login");
  };

  return (
    <div className="center_nav">
      <div className="navbar" ref={navbar}>
        <div className="one">
          <div className="up" ref={up}>
            <div className="logo" ref={logo}>
              <a href="" className="a flex" ref={company_name}>
                WALKEZ
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
            {headings.map((item, index) => (
              <Link to={item.a} key={index}>
                <div className="text_icon">
                  <img src={item.icon} alt="" className="logos_heading" />
                  <h3 className={`nav_heading ${cross_click ? "hide" : ""}`}>
                    {item.text}
                  </h3>
                </div>
              </Link>
            ))}
            {login_button ? (
              ""
            ) : (
              <Link to={"/user/upload"} onClick={check_session}>
                <div className="text_icon">
                  <img
                    src={"../logos/upload.png"}
                    alt=""
                    className="logos_heading"
                  />
                  <h3 className={`nav_heading ${cross_click ? "hide" : ""}`}>
                    {"Upload "}
                  </h3>
                </div>
              </Link>
            )}
            {login_button ? (
              ""
            ) : (
              <Link to={"/user/profile"} onClick={check_session}>
                <div className="text_icon">
                  <img
                    src={"../logos/profile.svg"}
                    alt=""
                    className="logos_heading"
                  />
                  <h3 className={`nav_heading ${cross_click ? "hide" : ""}`}>
                    {"Profile"}
                  </h3>
                </div>
              </Link>
            )}
          </div>
        </div>
        <div className="login_logout">
          {login_button ? (
            <Link to="/login">
              <button className="login_logout_btns">
                <img src="../logos/login.png" alt="" />
                {!cross_click && <h3>Login</h3>}
              </button>
            </Link>
          ) : (
            <button className="login_logout_btns" onClick={logout}>
              <img src="../logos/logout.png" alt="" />
              {!cross_click && <h3>Logout</h3>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation_bar;
