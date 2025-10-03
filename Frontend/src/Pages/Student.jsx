import React, { useState, useEffect } from "react";
import studentService from "../Services/studentServices";
import courseService from "../Services/courseServices"; 
import batchService from "../Services/batchServices";   
import "../Styles/student.css";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [groups] = useState(["W1", "W2","D1","D2","B1","B2","A1","A2","E1","E2"]); 

  const [updateForm, setUpdateForm] = useState({
    student_id: "",
    firstName: "",
    lastName: "",
    email: "",
    prnNo: "",
    course_id: "",
    batch_id: "",
    group_name: "",
  });

  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // ===== Load courses and batches for dropdowns =====
  const loadCoursesBatches = async () => {
    try {
      const courseData = await courseService.fetchAllCourses();
      const batchData = await batchService.fetchAllBatches();
      setCourses(courseData || []);
      setBatches(batchData || []);
    } catch (err) {
      console.error("Error loading courses/batches:", err);
    }
  };

  // ===== Load students and map course/batch names =====
  const loadStudents = async () => {
    setLoading(true);
    try {
      const studentData = await studentService.fetchAllStudents();

      const mapped = studentData.map((s) => ({
        student_id: s.student_id || "",
        firstName: s.firstName || "",
        lastName: s.lastName || "",
        email: s.email || "",
        prnNo: s.prnNo || "",
        course_id: s.course_id ?? "",
        batch_id: s.batch_id ?? "",
        group_name: s.group_name || "",
        course_name: courses.find(c => String(c.course_id) === String(s.course_id))?.course_name || "Not assigned",
        batch_name: batches.find(b => b.batch_id === s.batch_id)?.batch_name || "Not assigned",
      }));

      setStudents(mapped);
    } catch (err) {
      console.error("Error loading students:", err);
      setStudents([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCoursesBatches();
  }, []);

  useEffect(() => {
    if (courses.length > 0 && batches.length > 0) {
      loadStudents();
    }
  }, [courses, batches]);

  // ===== Handlers =====
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (student) => {
    setUpdateForm({
      ...student,
      course_id: student.course_id || "",
      batch_id: student.batch_id || "",
      group_name: student.group_name || "",
    });
    setEditing(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        prnNo: updateForm.prnNo,
        course_id: updateForm.course_id,
        batch_id: updateForm.batch_id,
        group_name: updateForm.group_name,
      };

      const res = await studentService.updateStudent(updateForm.student_id, updatedData);

      if (res.status === "success") {
        setMessage({ type: "success", text: "Student updated successfully!" });
        setEditing(false);
        loadStudents();
      } else {
        setMessage({ type: "error", text: res.error || "Failed to update student" });
      }
    } catch (err) {
      console.error("Update error:", err);
      setMessage({ type: "error", text: "Failed to update student" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    const res = await studentService.deleteStudent(id);
    if (res.status === "success") {
      setMessage({ type: "success", text: "Student deleted successfully!" });
      loadStudents();
    } else setMessage({ type: "error", text: res.error || "Failed to delete student" });
  };

  if (loading) return <p>Loading students...</p>;

  return (
    <div className="student-table-container">
      <h2>Student Management</h2>
      {message.text && <div className={`student-message ${message.type}`}>{message.text}</div>}

      {/* ===== Update Form ===== */}
      {editing && (
        <form onSubmit={handleUpdateSubmit} className="student-form">
          {/* Read-only fields */}
          <input type="text" name="student_id" value={updateForm.student_id} disabled />
          <input type="text" name="firstName" value={updateForm.firstName} disabled />
          <input type="text" name="lastName" value={updateForm.lastName} disabled />
          <input type="email" name="email" value={updateForm.email} disabled />

          {/* Editable fields */}
          <input
            type="text"
            name="prnNo"
            value={updateForm.prnNo}
            onChange={handleUpdateChange}
            placeholder="Enter PRN"
            required
          />

          <select name="course_id" value={updateForm.course_id} onChange={handleUpdateChange} required>
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c.course_id} value={String(c.course_id)}>
                {c.course_name}
              </option>
            ))}
          </select>

          <select name="batch_id" value={updateForm.batch_id} onChange={handleUpdateChange} required>
            <option value="">Select Batch</option>
            {batches.map((b) => (
              <option key={b.batch_id} value={b.batch_id}>
                {b.batch_name}
              </option>
            ))}
          </select>

          <select name="group_name" value={updateForm.group_name} onChange={handleUpdateChange} required>
            <option value="">Select Group</option>
            {groups.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <button type="submit" className="student-btn add">Update Student</button>
          <button type="button" onClick={() => setEditing(false)} className="student-btn delete">
            Cancel
          </button>
        </form>
      )}

      {/* ===== Students Table ===== */}
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table className="student-table">
          <thead>
            <tr>
              <th>ID</th><th>First Name</th><th>Last Name</th><th>Email</th><th>PRN</th>
              <th>Course</th><th>Batch</th><th>Group</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.student_id}>
                <td>{s.student_id}</td>
                <td>{s.firstName}</td>
                <td>{s.lastName}</td>
                <td>{s.email}</td>
                <td>{s.prnNo || "Not assigned"}</td>
                <td>{s.course_name || "Not assigned"}</td>
                <td>{s.batch_name || "Not assigned"}</td>
                <td>{s.group_name || "Not assigned"}</td>
                <td style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                  <button className="student-btn edit" onClick={() => startEdit(s)}>Edit</button>
                  <button className="student-btn delete" onClick={() => handleDelete(s.student_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
