import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../CSS/User_Css/Register.css";
import { toast } from "react-toastify";
import Loader from "../User_Pages/Components/Loader";
import { tenent_store_cookies_data } from "../../Utility/TenentCookies";
import { City, Country, State } from "country-state-city";
import { CitiesAPI } from "../../Utility/States";

const Tenent_Register = () => {
  const navigate = useNavigate();
  const [admin_name, setAdmin_name] = useState("");
  const [admin_email, setAdmin_email] = useState("");
  const [admin_password, setAdmin_password] = useState("");
  const [admin_password_retype, setAdmin_password_retype] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  // Fetch states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      //   console.log(Country.getAllCountries());
      const states = State.getStatesOfCountry("IN");

      console.log(states);
      setStates(states);
    };

    fetchStates();
  }, []);

  // Fetch cities when a state is selected
  useEffect(() => {
    const fetchCities = async () => {
      if (!state) return;

      const cities = City.getCitiesOfState("IN", state);
      setCities(cities);
    };

    fetchCities();
  }, [state]);

  const register = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log(
      admin_name,
      admin_email,
      admin_password,
      admin_password_retype,
      city,
      state,
      phoneNumber
    );
    const apiUrl = import.meta.env.VITE_REACT_APP_URL;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: admin_name,
        email: admin_email,
        password: admin_password,
        city: city,
        state: state,
        phone: phoneNumber,
      }),
    };

    const response = await fetch(`${apiUrl}/tenent_admin/register`, options);
    const data = await response.json();
    if (response.status === 200) {
      toast.success(data.message);
      setAdmin_name("");
      setAdmin_email("");
      setAdmin_password("");
      setAdmin_password_retype("");
      setPhoneNumber("");
      setCity("");
      setState("");
      tenent_store_cookies_data(data.refresh_token, data.access_token);
      navigate("/tenent/home");
    } else {
      toast.error(data.message);
    }
    setLoading(false);
  };

  return (
    <div className="body1">
      {loading ? (
        <div className="bg-[rgba(32,13,13,0.27)] w-[200%] h-[100vh] justify-center items-center flex">
          <Loader />
        </div>
      ) : (
        <div className="login-container">
          <h1 className="login-title">WALKEZ</h1>
          <h2 className="login-subtitle">Admin Register</h2>
          <form className="login-form" onSubmit={register} method="post">
            <input
              type="email"
              placeholder="Email"
              required
              className="login-input"
              value={admin_email}
              onChange={(e) => setAdmin_email(e.target.value)}
            />
            <input
              type="text"
              placeholder="Username"
              required
              className="login-input"
              value={admin_name}
              onChange={(e) => setAdmin_name(e.target.value)}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              className="login-input"
              value={admin_password}
              onChange={(e) => setAdmin_password(e.target.value)}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              required
              className="login-input"
              value={admin_password_retype}
              onChange={(e) => setAdmin_password_retype(e.target.value)}
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
            <select
              className="login-input"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            >
              <option value="" disabled>
                Select State
              </option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
            <select
              className="login-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!state}
              required
            >
              <option value="" disabled>
                Select City
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Phone Number"
              required
              className="login-input"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <input type="submit" value="Register" className="login-submit" />
          </form>
          <div className="login-text">
            <Link to={`/tenent/login`} className="login-link">
              Already have an account? Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tenent_Register;
