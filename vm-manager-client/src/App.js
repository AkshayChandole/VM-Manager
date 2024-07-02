import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import VMForm from "./components/VMForm";
import VMList from "./components/VMList";
import { getVMs, addVM, deleteVM, connectVM } from "./services/vmService"; // Assuming you have implemented these service functions
import { Monitor } from "lucide-react";
const App = () => {
  const [vms, setVMs] = useState([]);

  useEffect(() => {
    loadVMs();
  }, []);

  const loadVMs = async () => {
    try {
      const response = await getVMs(); // Implement this function to fetch VMs from backend
      setVMs(response.data);
    } catch (error) {
      toast.error("Failed to load VMs");
    }
  };

  const handleAddVM = async (newVMData) => {
    try {
      await addVM(newVMData); // Implement this function to add VM to backend
      toast.success("VM added successfully");
      loadVMs(); // Refresh VM list after adding new VM
    } catch (error) {
      toast.error("Failed to add VM");
    }
  };

  const handleDeleteVM = async (vmName) => {
    try {
      await deleteVM(vmName); // Implement this function to delete VM from backend
      toast.success("VM deleted successfully");
      loadVMs(); // Refresh VM list after deleting VM
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
    <div className="App">
      <header className="App-header">
        <h1>
          <Monitor className="App-header-monitor" size={26} />
          VM Manager
        </h1>
      </header>
      <main>
        <VMForm onAddVM={handleAddVM} />
        <VMList
          vms={vms}
          onConnectVM={handleConnectVM}
          onDeleteVM={handleDeleteVM}
        />
      </main>
      <footer className="App-footer">
        <p>&copy; 2024 VM Manager</p>
      </footer>
      <ToastContainer />
    </div>
  );
};

export default App;
