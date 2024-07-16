import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Monitor } from "lucide-react";
import "../styles/NavBar.css";

const NavBar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <Monitor className="App-header-monitor" size={26} />
        <span className="navbar-title">VM Manager for Windows</span>
      </div>
      {isAuthenticated && (
        <div className="navbar-links">
          <NavLink
            exact="true"
            to="/vms"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            My VMs
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            My Users
          </NavLink>

          <button className="nav-link logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
