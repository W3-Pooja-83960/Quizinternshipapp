import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear stored data
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role"); 
    localStorage.removeItem("token"); 

    // Redirect to login
    navigate("/login");
  }, [navigate]);

  return null; 
}

export default Logout;
