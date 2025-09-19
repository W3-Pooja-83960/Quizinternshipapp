import React from "react";
import NavBar from "./Components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Batches from "./Pages/Batches";

import Course from "./Pages/Course";



const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/batch" element={<Batches />} /> 
        <Route path="/courses" element={<Course />} /> 
        
      
      </Routes>
      
    </>
  );
};

export default App;
