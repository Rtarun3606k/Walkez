import React from "react";
import { Link, redirect } from "react-router-dom";
import "../../CSS/User_Css/Login.css";
import { store_cookies_data } from "../../Utility/Auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const User_Login = () => {
  const navigate = useNavigate();
  const [user_email, setUser_email] = useState("");
  const [user_password, setUser_password] = useState("");

  const login = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_REACT_APP_URL;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_email: user_email,
        user_password: user_password,
      }),
    };

    const response = await fetch(`${apiUrl}/user_route/login`, options);
    const data = await response.json();
    if (response.status === 200) {
      store_cookies_data(data.refresh_token, data.access_token);
      toast.success(data.message);
      setUser_email("");
      setUser_password("");
      navigate("/");
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="body1">
      <div className="body">
        <div className="login_container">
          <h1 className="name">
            WALKEZ <img src="" alt="" />
          </h1>
          <h2 className="login">Login</h2>
          <form className="login_form" method="post" onSubmit={login}>
            <input
              type="text"
              placeholder="User email"
              required
              className="inputtxt"
              value={user_email}
              onChange={(e) => setUser_email(e.target.value)}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              required
              className="inputtxt"
              value={user_password}
              onChange={(e) => setUser_password(e.target.value)}
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
