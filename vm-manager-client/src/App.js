import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import VMManagerSubpage from "./components/VMManagerSubpage";
import NavBar from "./components/NavBar";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import UserManagerSubpage from "./components/UserManagerSubpage";
import { ToastContainer } from "react-toastify";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <NavBar onLogout={handleLogout} />
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/vms" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          exact
          path="/"
          element={
            isAuthenticated ? <VMManagerSubpage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/users"
          element={
            isAuthenticated ? <UserManagerSubpage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/vms"
          element={
            isAuthenticated ? <VMManagerSubpage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="*"
          element={
            isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />
          }
        />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
