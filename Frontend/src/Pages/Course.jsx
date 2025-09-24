import React, { useEffect, useState } from "react";
import courseService from "../Services/courseServices"; 
import "../Styles/course.css";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ id: "", name: "" });
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseService.fetchAllCourses();
      console.log("Fetched courses:", response);

      if (Array.isArray(response)) {
        // Map backend field names to frontend
        const mapped = response.map((course) => ({
          id: course.course_id,
          name: course.course_name !== null && course.course_name !== undefined
                    ? course.course_name
                    : "(Unnamed)",
        }));

        setCourses(mapped);
      } else {
        console.error("Unexpected response format, expected array:", response);
        setCourses([]);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      setCourses([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        id: parseInt(newCourse.id, 10),
        name: newCourse.name,
      };
      if (editingCourse) {
        await courseService.updateCourse(editingCourse.id, courseData);
      } else {
        await courseService.addCourse(courseData);
      }
      setNewCourse({ id: "", name: "" });
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      console.error("Failed to save course:", error);
    }
  };

  const handleEditClick = (course) => {
    setEditingCourse(course);
    setNewCourse({ id: course.id.toString(), name: course.name });
  };

  const handleDeleteClick = async (id) => {
    try {
      await courseService.deleteCourse(id);
      fetchCourses();
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  return (
    <div className="table-container">
      <h2>Course Management</h2>

      <form className="course-form" onSubmit={handleFormSubmit}>
        <input
          type="number"
          name="id"
          placeholder="Course ID"
          value={newCourse.id}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Course Name"
          value={newCourse.name}
          onChange={handleInputChange}
          required
        />
        <button type="submit">
          {editingCourse ? "Update Course" : "Add Course"}
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Course Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn edit" onClick={() => handleEditClick(course)}>
                      Edit
                    </button>
                    <button className="btn delete" onClick={() => handleDeleteClick(course.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No courses found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Course;
