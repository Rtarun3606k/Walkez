import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../CSS/User_Css/Register.css";
import { useState } from "react";
import { toast } from "react-toastify";
import GoogleButton from "./Components/GoogleButton";
import { store_cookies_data } from "../../Utility/Auth";
import Loader from "./Components/Loader";
// import { signInWithGoogle } from "../../Utility/Firebase.config";

const User_Register = () => {
  const navigate = useNavigate();
  const [admin_name, setUser_name] = useState("");
  const [admin_email, setUser_email] = useState("");
  const [admin_password, setUser_password] = useState("");
  const [admin_password_retype, setUser_password_retype] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  // register function
  const register = async (e) => {
    e.preventDefault();
    setLoading(true);
    // await sleep(3000000);
    const apiUrl = import.meta.env.VITE_REACT_APP_URL;
    console.log(apiUrl);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        admin_name: admin_name,
        admin_email: admin_email,
        admin_password: admin_password,
        admin_password_retype: admin_password_retype,
      }),
    };

    const response = await fetch(`${apiUrl}/admin_route/register`, options);
    const data = await response.json();
    if (response.status === 200) {
      // alert(data.message);
      toast.success(data.message);
      setAdmin_name("");
      setAdmin_email("");
      setAdmin_password("");
      setAdmin_password_retype("");
      store_cookies_data(data.refresh_token, data.access_token);
      // toast.success(data.message);
      navigate("/");
      // setLoading(true);
    } else {
      toast.error(data.message);
    }
    setLoading(false);
  };

  return (
    <div className="body1 mr-[-2%]">
      {loading ? (
        <div className="bg-[rgba(32,13,13,0.27)] w-[200%] h-[100vh] justify-center items-center flex mr-[-20%]">
          <Loader />
        </div>
      ) : (
        <div className="login-container">
          <h1 className="login-title">
            WALKEZ <img src="" alt="" />
          </h1>
          <h2 className="login-subtitle">Admin Register</h2>
          <form className="login-form" onSubmit={register} method="post">
            <input
              type="email"
              placeholder="Email"
              required
              className="login-input"
              value={admin_email}
              onChange={(e) => setUser_email(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              required
              className="login-input"
              value={admin_name}
              onChange={(e) => setUser_name(e.target.value)}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              className="login-input"
              value={admin_password}
              onChange={(e) => setUser_password(e.target.value)}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              required
              className="login-input"
              value={admin_password_retype}
              onChange={(e) => setUser_password_retype(e.target.value)}
            />
            <div className="showPassword">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />{" "}
              Show Password
            </div>
            <input type="submit" value="Register" className="login-submit" />
            <GoogleButton isLogin={false} />
          </form>
          <div className="login-text">
            <Link to={`/login`} className="login-link">
              Already have an account? Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default User_Register;
