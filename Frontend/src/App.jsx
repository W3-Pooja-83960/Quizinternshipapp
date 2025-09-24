import React from "react";
import NavBar from "./Components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Batches from "./Pages/Batches";

import Course from "./Pages/Course";
import Students from "./Pages/Students";



const App = () => {
  localStorage.setItem("token", "abcd");
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/batch" element={<Batches />} /> 
        <Route path="/courses" element={<Course />} /> 
        <Route path="/students" element={<Students />} />
        
      
      </Routes>
      
    </>
  );
};

export default App;
