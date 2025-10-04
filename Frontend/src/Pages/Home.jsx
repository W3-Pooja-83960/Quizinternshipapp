import React from "react";
import "../Styles/home.css";
import { useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const welcomeMsg = location.state?.message || "Welcome Admin"; 

  return (
    <div className="home-container">
      {/* Display welcome message */}
      <h2 className="welcome-message">{welcomeMsg}</h2>

      <h1>Welcome to Quiz App</h1>
      <p>This is the home page. Use the navbar to navigate to different sections.</p>

      <div className="home-cards">
        <div className="card">
          <h3>DAC</h3>
          <p>Post Graduate Diploma In Advanced Computing</p>
        </div>

        <div className="card">
          <h3>DMC</h3>
          <p>Post Graduate Diploma in Mobile Computing</p>
        </div>

        <div className="card">
          <h3>DBDA</h3>
          <p>Post Graduate Diploma in Big Data Analytics</p>
        </div>

        <div className="card">
          <h3>DITISS</h3>
          <p>Post Graduate Diploma in IT Infrastructure, Systems and Security</p>
        </div>

        <div className="card">
          <h3>DESD</h3>
          <p>Post Graduate Diploma in Embedded Systems Design</p>
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