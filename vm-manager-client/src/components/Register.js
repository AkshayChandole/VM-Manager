import React, { useState } from "react";
import { registerUser } from "../services/userAccoutService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import { encryptPassword } from "../services/passwordService";

const Register = () => {
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
      await registerUser({ ...formData, password: encryptedPassword });
      toast.success("User registered successfully");
      navigate("/vms");
    } catch (error) {
      toast.error("Username already exists");
    }
  };

  return (
    <div className="register-page">
      <div className="auth-form">
        <h2>Register</h2>
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
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account?{" "}
          <span className="link" onClick={() => navigate("/login")}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
