import React, { useState } from "react";
import { loginUser } from "../services/userAccoutService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { encryptPassword } from "../services/passwordService";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const SECRET_KEY = process.env.REACT_APP_LOGIN_PASSWORD_SECRET_KEY;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const encryptedPassword = encryptPassword(formData.password, SECRET_KEY);

    try {
      const response = await loginUser({
        ...formData,
        password: encryptedPassword,
      });
      localStorage.setItem("token", response.data.token);
      window.location.href = "/";
      toast.success("Login successful");
      onLogin();
    } catch (error) {
      toast.error("Invalid username or password");
    }
  };

  return (
    <div className="login-page">
      <div className="auth-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={formData.username}
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account?{" "}
          <span className="link" onClick={() => navigate("/register")}>
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
