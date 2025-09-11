//import React, { Component } from 'react';
import {Routes, Route} from 'react-router-dom';
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
import Students from './pages/students';


const AppRoutes=()=>{

    return(
        <Routes>
            <Route path="/" element={<Login/>}  />
            <Route path="/dashboard" element={<Dashboard/>}  />
            <Route path="/students" element={<Students />} />
        </Routes>
    )
}

export default AppRoutes;