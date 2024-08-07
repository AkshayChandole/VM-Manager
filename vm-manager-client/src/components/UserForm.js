import React, { useState } from "react";
import "../styles/UserForm.css";
import { encryptPassword } from "../services/passwordService";

const UserForm = ({ onAddUser }) => {
  const [newUser, setNewUser] = useState({ username: "", password: "" });

  const SECRET_KEY = process.env.REACT_APP_USER_PASSWORD_SECRET_KEY;

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const encryptedPassword = encryptPassword(newUser.password, SECRET_KEY);
    onAddUser({ ...newUser, password: encryptedPassword });
    setNewUser({ username: "", password: "" });
  };

  return (
    <div className="user-form">
      <h2>Add new user</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          value={newUser.username}
          placeholder="Username"
          onChange={handleFormChange}
        />
        <input
          type="password"
          name="password"
          value={newUser.password}
          placeholder="Password"
          onChange={handleFormChange}
        />
        <button type="submit">New User</button>
      </form>
    </div>
  );
};

export default UserForm;
