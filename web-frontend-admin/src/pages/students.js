import Navbar from "../components/Navbar";
//import "../css/Students.css";

const Students = () => {
  return (
    <div className="students-container">
      {/* Navbar on top */}
      <Navbar />

      {/* Students content */}
      <div className="students-content">
        <h1>Students Management</h1>
        <p>This is where you can manage students.</p>
      </div>
    </div>
  );
};

export default Students;