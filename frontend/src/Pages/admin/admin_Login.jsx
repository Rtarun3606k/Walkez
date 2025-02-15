import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../CSS/User_Css/Login.css"; // You might want to create a separate CSS file for Admin
import { admin_store_cookies_data } from "../../Utility/AdminAuth";
import Loader from "../User_Pages/Components/Loader";

const Admin_Login = () => {
  const navigate = useNavigate();
  const [admin_email, setAdmin_email] = useState("");
  const [admin_password, setAdmin_password] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    const apiUrl = import.meta.env.VITE_REACT_APP_URL;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        admin_email: admin_email,
        admin_password: admin_password,
      }),
    };

    const response = await fetch(`${apiUrl}/admin/login`, options); // Changed endpoint to admin_route
    const data = await response.json();
    if (response.status === 200) {
      console.log(data);
      store_cookies_data(data.tokens.refresh_token, data.tokens.access_token);
      toast.success(data.message);
      setAdmin_email(""); // Resetting the form fields
      setAdmin_password("");
      // admin_store_cookies_data(data.refresh_token, data.access_token); // Storing admin data in cookies
      navigate("/admin"); // Redirecting to admin dashboard
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
        <div className="flex justify-center items-center h-screen">
          <div className="login_container">
            <h1 className="name">
              PATHA <img src="" alt="" />
            </h1>
            <h2 className="login">ADMIN LOGIN</h2> {/* Updated title */}
            <form className="login_form" method="post" onSubmit={login}>
              <input
                type="text"
                placeholder="Admin email" // Updated placeholder
                required
                className="inputtxt"
                value={admin_email}
                onChange={(e) => setAdmin_email(e.target.value)}
              />
              <br />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="inputtxt"
                value={admin_password}
                onChange={(e) => setAdmin_password(e.target.value)}
              />
              <div className="showPassword">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                Show Password
              </div>
              <div className="w-[82%] flex justify-center flex-col align-middle">
                <input
                  type="submit"
                  className="submit1 w-[122%]"
                  value="Login"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin_Login;
