// src/components/Login.jsx

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../style/login.css";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../../services/loginService";
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // For handling loading state
  const [error, setError] = useState(null); // For handling error messages

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(formData); // Pass the entire formData object
      login(data.token, data.role); // Pass only the token
      if (data.role === "Admin") {
        navigate("/admin-dashboard");
      } else if (data.role === "Employee") {
        navigate("/employee-dashboard");
      } else {
        navigate("/hr-dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container-fluid flex flex-col md:flex-row LoginImage justify-between items-center">
      <div className="Logo h-1/2 md:h-full w-full md:w-[30.5vw]  bg-green-0 text-center flex justify-center items-center">
        <Link to={"/"} className="image">
        <img
          src="hrm-high-resolution-logo-white-transparent.ico"
          alt="Logo"
          className="md:w-[30.5wh] ml-auto mr-auto"
        />
        </Link>
      </div>
      <div className="bg-white h-auto md:h-full w-full md:w-[47.5vw] card rounded-l-3xl text-center font-martel">
        <h1 className="text-blue-950 text-5xl mt-20">Welcome!</h1>
        <p className="text-palette-4 text-3xl mt-5">Please login to continue</p>
        <form onSubmit={handleSubmit} className="mt-24 text-start ml-8 mr-8">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <label htmlFor="email" className="text-2xl text-palette-3 p-2">
            Email Address
          </label>
          <div className="mt-1 mb-6">
            <input
              type="email"
              name="email"
              id="loginEmailId"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-palette-5 text-palette-1 w-full h-14 text-l p-4 rounded-lg drop-shadow-xl"
            />
          </div>
          <label htmlFor="password" className="text-2xl text-palette-3 p-2">
            Password
          </label>
          <div className="mt-1 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="loginPasswordId"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-palette-5 text-palette-1 w-full h-14 text-l p-4 rounded-lg drop-shadow-xl"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-palette-4"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="mt-16 mb-6 text-center">
            <button
              type="submit"
              className="bg-palette-3 text-white w-1/4 h-14 rounded-3xl text-2xl drop-shadow-xl"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
