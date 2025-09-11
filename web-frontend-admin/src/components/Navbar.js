
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Navbar.css";
const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
  
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2 className="logo">Admin Panel</h2>
      </div>

      <nav className="navbar-links">
        <Link to="/staff">Staff</Link>
        <Link to="/students">Students</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/quizzes">Quizzes</Link>
      
      </nav>

      <div className="navbar-right">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
