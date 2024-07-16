import React, { useEffect, useState } from "react";
import {
  addUser,
  deleteUser,
  editUser,
  getUsers,
} from "../services/userService";
import { toast } from "react-toastify";
import UserForm from "./UserForm";
import UserList from "./UserList";
import "../styles/UserManagerSubpage.css";

const UserManagerSubpage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  const handleAddUser = async (newUserData) => {
    try {
      await addUser(newUserData);
      toast.success("User added successfully");
      loadUsers();
    } catch (error) {
      toast.error("Failed to add user");
    }
  };

  const handleEditUser = async (username, newUserData) => {
    try {
      await editUser(username, newUserData);
      toast.success("User updated successfully");
      loadUsers();
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (username) => {
    try {
      await deleteUser(username);
      toast.success("User deleted succesfully");
      loadUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="user-manager-subpage">
      <UserForm onAddUser={handleAddUser} />
      <UserList
        users={users}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default UserManagerSubpage;
