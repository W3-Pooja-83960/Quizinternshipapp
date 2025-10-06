import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/navbar.css";

const NavBar = () => {
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
        <Link to="/home">Home</Link>        
        <Link to="/batch">Batches</Link>
        <Link to="/course">Courses</Link>
        <Link to="/modules">Modules</Link>
        <Link to="/staff">Staff</Link>
        <Link to="/students">Students</Link>       
        <Link to="/quizzes">Quizzes</Link>
       <Link to="/results">Results</Link>


             
      </nav>

      <div className="navbar-right">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
};


export default NavBar;