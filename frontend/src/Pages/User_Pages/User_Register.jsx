import React from "react";
import { Link } from "react-router-dom";
import "../../CSS/User_Css/Register.css";

const User_Register = () => {
  return (
    <body class="body1">
      <div class="login-container">
        <h1 class="login-title">
          WALKEZ <img src="" alt="" />
        </h1>
        <h2 class="login-subtitle">Register</h2>
        <form class="login-form" action="/register" method="post">
          <input
            type="text"
            placeholder="Full Name"
            required
            class="login-input"
          />
          <input
            type="email"
            placeholder="Email"
            required
            class="login-input"
          />
          <input
            type="text"
            placeholder="Username"
            required
            class="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            required
            class="login-input"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            required
            class="login-input"
          />
          <input type="submit" value="Register" class="login-submit" />
        </form>
        <p class="login-text">
          Already have an account?{" "}
          <Link to={`/login`} class="login-link">
            Login
          </Link>
        </p>
      </div>
    </body>
  );
};

export default User_Register;
