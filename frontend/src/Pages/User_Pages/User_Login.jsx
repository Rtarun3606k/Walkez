import React from "react";
import { Link } from "react-router-dom";
import "../../CSS/User_Css/Login.css";

const User_Login = () => {
  return (
    <div className="body1">
      <div className="body">
        <div className="login_container">
          <h1 className="name">
            WALKEZ <img src="" alt="" />
          </h1>
          <h2 className="login">Login</h2>
          <form className="login_form" method="post">
            <input
              type="text"
              placeholder="Username"
              required
              className="inputtxt"
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              required
              className="inputtxt"
            />
            <br />
            <button type="submit" className="submit1">
              Login
            </button>
          </form>
          <p className="signup_link">
            Don't have an account?{" "}
            <Link to={`/register`} className="link1">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default User_Login;
