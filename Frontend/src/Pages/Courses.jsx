import React, { useState, useEffect } from "react";
import courseService from "../Services/courseServices";
import "../Styles/courses.css";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Course Form state
  const [addForm, setAddForm] = useState({ id: "", name: "" });
  const [updateForm, setUpdateForm] = useState({ id: "", name: "" });

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);

  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    const result = await courseService.fetchAllCourses();
    setCourses(result || []);
    setLoading(false);
  };

  // ===== Add Course Handlers =====
  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await courseService.addCourse(addForm);
      setAddForm({ id: "", name: "" });
      setAdding(false);
      setMessage({ type: "success", text: "Course added successfully!" });
      loadCourses();
    } catch {
      setMessage({ type: "error", text: "Failed to add course!" });
    }
  };

  // ===== Update Course Handlers =====
  const handleUpdateChange = (e) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await courseService.updateCourse(updateForm.id, updateForm);
      setEditing(false);
      setUpdateForm({ id: "", name: "" });
      setMessage({ type: "success", text: "Course updated successfully!" });
      loadCourses();
    } catch {
      setMessage({ type: "error", text: "Failed to update course!" });
    }
  };

  const startEdit = (course) => {
    setUpdateForm({ id: course.course_id, name: course.course_name });
    setEditing(true);
  };

  // ===== Delete Course =====
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (confirmDelete) {
      try {
        await courseService.deleteCourse(id);
        setMessage({ type: "success", text: "Course deleted successfully!" });
        loadCourses();
      } catch {
        setMessage({ type: "error", text: "Failed to delete course!" });
      }
    }
  };

  if (loading) return <p>Loading courses...</p>;

  return (
    <div className="course-table-container">
      <h2>Course Management</h2>

      {/* Notification */}
      {message.text && (
        <div className={`course-message ${message.type}`}>{message.text}</div>
      )}

      {/* Add Button */}
      {!adding && !editing && (
        <button className="course-add-button" onClick={() => setAdding(true)}>
          Add Course
        </button>
      )}

      {/* Add Form */}
      {adding && (
        <form onSubmit={handleAddSubmit} className="course-form">
          <input
            type="number"
            name="id"
            placeholder="Course ID"
            value={addForm.id}
            onChange={handleAddChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Course Name"
            value={addForm.name}
            onChange={handleAddChange}
            required
          />
          <button type="submit">Add Course</button>
          <button type="button" onClick={() => setAdding(false)}>
            Cancel
          </button>
        </form>
      )}

      {/* Update Form */}
      {editing && (
        <form onSubmit={handleUpdateSubmit} className="course-form">
          <input type="number" name="id" value={updateForm.id} disabled />
          <input
            type="text"
            name="name"
            value={updateForm.name}
            onChange={handleUpdateChange}
            required
          />
          <button type="submit">Update Course</button>
          <button type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </form>
      )}

      {/* Courses Table */}
      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <table className="course-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Course Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.course_id}>
                <td>{course.course_id}</td>
                <td>{course.course_name}</td>
                <td style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                  <button
                    className="course-edit-button"
                    onClick={() => startEdit(course)}
                  >
                    Edit
                  </button>
                  <button
                    className="course-delete-button"
                    onClick={() => handleDelete(course.course_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
