import React, { useEffect, useState } from "react";
import { getUsers } from "../services/userService";
import "../styles/VMForm.css";

const VMForm = ({ onAddVM, usersAvailable }) => {
  const [newVM, setNewVM] = useState({
    name: "",
    id: "",
    domain: "",
    username: "",
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewVM((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onAddVM(newVM);
    setNewVM({
      name: "",
      ip: "",
      domain: "",
      username: "",
    });
  };

  return (
    <div className="vm-form">
      <h2>Add New VM</h2>
      {!usersAvailable ? (
        <p className="watermark">
          No users available. Please go to 'My Users' tab and add a new user
          first before adding a new VM.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={newVM.name}
            placeholder="VM Name"
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="ip"
            value={newVM.ip}
            placeholder="IP Address"
            onChange={handleFormChange}
            required
          />
          <input
            type="text"
            name="domain"
            value={newVM.domain}
            placeholder="Domain"
            onChange={handleFormChange}
            required
          />
          <select
            name="username"
            value={newVM.username}
            placeholder="Username"
            onChange={handleFormChange}
            required
          >
            <option value="">Select user</option>
            {users.map((user) => (
              <option key={user.username} value={user.username}>
                {user.username}
              </option>
            ))}
          </select>
          <button type="submit">Add VM</button>
        </form>
      )}
    </div>
  );
};

export default VMForm;
