
import React from "react";
import Navbar from "../components/Navbar";
import "../css/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Navbar on top */}
      <Navbar />

      {/* Dashboard content */}
      <div className="dashboard-content">
        <h1>Welcome to Admin Dashboard</h1>
        <p>Select a section from the navigation above to manage your quiz app.</p>
      </div>
    </div>
  );
};

export default Dashboard;
