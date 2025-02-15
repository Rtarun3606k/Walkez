import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { check_token } from "../../../Utility/Cookies_validator";
import { delete_cookies_storedata } from "../../../Utility/Auth";
import "../../../CSS/User_Css/Nav.css";

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkSession = async () => {
    const isValid = await check_token();
    if (!isValid) {
      navigate("/login");
    }
    return isValid;
  };

  useEffect(() => {
    setIsLoggedIn(check_token());
  }, []);

  const navigationItems = [
    { icon: "/logos/home.png", text: "Home", path: "/" },
    { icon: "/logos/about.png", text: "About", path: "/user/about" },
    { icon: "/logos/sevices.png", text: "Services", path: "/user/service" },
    { icon: "/logos/contact.png", text: "Contact", path: "/user/contact" },
  ];

  const userItems = [
    // { icon: "/logos/upload.png", text: "Upload", path: "/user/upload" },
    { icon: "/logos/profile.svg", text: "Profile", path: "/user/profile" },
  ];

  const handleLogout = () => {
    delete_cookies_storedata();
    setIsLoggedIn(false);
    navigate("/login");
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-container">
        <div className="sidebar-header">
          <div className="logo-container">
            {!isCollapsed && <span className="brand-name">PATHA</span>}
            <img src="/logos/logo.svg" alt="Logo" className="logo" />
          </div>
          <button
            className="collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <img
              src={isCollapsed ? "/logos/ham.svg" : "/logos/cross.svg"}
              alt="Toggle"
              className="toggle-icon"
            />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${
                  isActivePath(item.path) ? "active" : ""
                }`}
              >
                <img src={item.icon} alt={item.text} className="nav-icon" />
                {!isCollapsed && <span className="nav-text">{item.text}</span>}
              </Link>
            ))}
          </div>

          {isLoggedIn && (
            <div className="nav-section">
              {userItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${
                    isActivePath(item.path) ? "active" : ""
                  }`}
                  onClick={checkSession}
                >
                  <img src={item.icon} alt={item.text} className="nav-icon" />
                  {!isCollapsed && (
                    <span className="nav-text">{item.text}</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          {isLoggedIn ? (
            <button className="auth-btn" onClick={handleLogout}>
              <img src="/logos/logout.png" alt="Logout" className="nav-icon" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          ) : (
            <Link to="/login" className="auth-btn">
              <img src="/logos/login.png" alt="Login" className="nav-icon" />
              {!isCollapsed && <span>Login</span>}
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
};

export default NavigationBar;
