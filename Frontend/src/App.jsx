import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./Components/Navbar";
import { getCurrentUser } from "./Components/auth"; 

import Home from "./Pages/Home";
import Batches from "./Pages/Batches";
import Quizzes from "./Pages/Quizzes";
import Questions from "./Pages/Questions";
import ViewQuestions from "./Pages/ViewQuestions";
import Course from "./Pages/Courses";
import Staff from "./Pages/Staff";
import Login from "./Components/Login";
import Students from "./Pages/Student";
import Modules from "./Pages/Modules";


const App = () => {
  const user = getCurrentUser(); // ✅ get logged-in user
  console.log(user);
  const location = useLocation();
  const hideNav = location.pathname === "/" || location.pathname === "/login";

  return (
    <>
      {!hideNav && <NavBar user={user} />} 
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/batch" element={<Batches />} />
        <Route path="/modules" element={<Modules />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/view-questions/:quizId" element={<ViewQuestions />} /> 
        <Route path="/questions/:quiz_id" element={<Questions />} />
        <Route path="/course" element={<Course />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/students" element={<Students />} />
        <Route path="*" element={<Login />} />
      </Routes>
      

    </>
  );
};

export default App;

