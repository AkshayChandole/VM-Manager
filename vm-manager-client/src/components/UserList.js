import React, { useState } from "react";
import { decryptUserPassword } from "../services/userService";
import "../styles/UserList.css";

const UserList = ({ users, onEditUser, onDeleteUser }) => {
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({ username: "", password: "" });

  const handleEditClick = (user) => {
    setEditingUser(user.username);
    setEditData({ username: user.username, password: "" });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEditUser(editingUser, editData);
    setEditingUser(null);
  };

  const handleShowPassword = async (username) => {
    try {
      const response = await decryptUserPassword(username);
      alert(`Password : ${response.password}`);
    } catch (error) {
      console.error("Failed to decrypt password", error);
      alert("Failed to decrypt password");
    }
  };

  const handleDeleteUser = (username) => {
    if (
      window.confirm(
        `Deleting user ${username} will also delete all associated VMs. Are you sure to continue?`
      )
    ) {
      onDeleteUser(username);
    }
  };

  return (
    <div className="user-list">
      <h2>Users</h2>
      {users.length === 0 ? (
        <p className="no-users-watermark">No users available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Username</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.username}
                className={editingUser === user.username ? "editing" : ""}
              >
                <td>{index + 1}</td>
                <td>
                  {editingUser === user.username ? (
                    <input
                      type="text"
                      name="username"
                      value={editData.username}
                      onChange={handleEditChange}
                      required
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td>
                  {editingUser === user.username ? (
                    <input
                      type="password"
                      name="password"
                      value={editData.password}
                      onChange={handleEditChange}
                    />
                  ) : (
                    <button
                      className="show-password-button"
                      onClick={() => handleShowPassword(user.username)}
                    >
                      Show Password
                    </button>
                  )}
                </td>
                <td className="actions">
                  {editingUser === user.username ? (
                    <button className="save-button" onClick={handleEditSubmit}>
                      Save
                    </button>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(user)}>
                        Edit
                      </button>
                      <button
                        className="delete-user-btn"
                        onClick={() => handleDeleteUser(user.username)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
