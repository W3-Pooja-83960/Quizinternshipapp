import React from "react";
import "../Styles/home.css";
import { useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const welcomeMsg = location.state?.message || "Welcome Admin"; // fallback to "Admin"

  return (
    <div className="home-container">
      {/* Display welcome message */}
      <h2 className="welcome-message">{welcomeMsg}</h2>

      <h1>Welcome to Quiz App</h1>
      <p>This is the home page. Use the navbar to navigate to different sections.</p>

      <div className="home-cards">
        <div className="card">
          <h3>Batches</h3>
          <p>View all batches and their details.</p>
        </div>
        <div className="card">
          <h3>About</h3>
          <p>Learn more about this application.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
