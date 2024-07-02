import React, { useState } from "react";

const VMForm = ({ onAddVM }) => {
  const [newVM, setNewVM] = useState({
    name: "",
    domain: "",
    username: "",
    password: "",
  });

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
      domain: "",
      username: "",
      password: "",
    });
  };

  return (
    <div className="vm-form">
      <h2>Add New VM</h2>
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
          name="domain"
          value={newVM.domain}
          placeholder="Domain"
          onChange={handleFormChange}
          required
        />
        <input
          type="text"
          name="username"
          value={newVM.username}
          placeholder="Username"
          onChange={handleFormChange}
          required
        />
        <input
          type="password"
          name="password"
          value={newVM.password}
          placeholder="Password"
          onChange={handleFormChange}
          required
        />
        <button type="submit">Add VM</button>
      </form>
    </div>
  );
};

export default VMForm;
