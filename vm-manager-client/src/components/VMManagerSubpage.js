import React, { useEffect, useState } from "react";
import { addVM, connectVM, deleteVM, getVMs } from "../services/vmService";
import { toast } from "react-toastify";
import VMForm from "./VMForm";
import VMList from "./VMList";
import { getUsers } from "../services/userService";
import "../styles/VMManagerSubpage.css";

const VMManagerSubpage = () => {
  const [vms, setVMs] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadVMs();
    loadUsers();
  }, []);

  const loadVMs = async () => {
    try {
      const response = await getVMs();
      setVMs(response.data);
    } catch (error) {
      toast.error("Failed to load VMs");
    }
  };

  const loadUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  const handleAddVM = async (newVMData) => {
    try {
      await addVM(newVMData);
      toast.success("VM added successfully");
      loadVMs();
    } catch (error) {
      if (error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to add VM");
      }
    }
  };

  const handleDeleteVM = async (vmName) => {
    try {
      await deleteVM(vmName);
      toast.success("VM deleted successfully");
      loadVMs();
    } catch (error) {
      toast.error("Failed to delete VM");
    }
  };

  const handleConnectVM = async (vm) => {
    try {
      await connectVM(vm);
      toast.success("Attempting to connect the VM");
    } catch (error) {
      toast.error("Failed to connect VM");
    }
  };
  return (
    <div className="vm-manager-subpage">
      <VMForm
        onAddVM={handleAddVM}
        usersAvailable={users && users.length > 0}
      />
      <VMList
        vms={vms}
        onConnectVM={handleConnectVM}
        onDeleteVM={handleDeleteVM}
      />
    </div>
  );
};

export default VMManagerSubpage;
