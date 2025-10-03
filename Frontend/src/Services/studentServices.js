import axios from "axios";
import { BASE_URL } from "../Config";

// Helper: Get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Fetch all students
async function fetchAllStudents() {
  try {
    const response = await axios.get(`${BASE_URL}/students/all-students`, {
      headers: { ...getAuthHeaders(), "Cache-Control": "no-cache" }, // prevent 304
    });

    if (response.data.status === "success") {
      return response.data.data;
    } else {
      console.warn("Error fetching students:", response.data.error);
      return [];
    }
  } catch (error) {
    console.error("Fetch students failed:", error.response?.data || error.message);
    return [];
  }
}

// Add a student
async function addStudent(studentData) {
  try {
    const response = await axios.post(`${BASE_URL}/students/add-student`, studentData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Add student failed:", error.response?.data || error.message);
    return { status: "error", error: "Failed to add student" };
  }
}

// Update a student
async function updateStudent(id, studentData) {
  try {
    const response = await axios.put(`${BASE_URL}/students/update-student/${id}`, studentData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Update student failed:", error.response?.data || error.message);
    return { status: "error", error: "Failed to update student" };
  }
}

// Delete a student
async function deleteStudent(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/students/delete-student/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Delete student failed:", error.response?.data || error.message);
    return { status: "error", error: "Failed to delete student" };
  }
}

export default {
  fetchAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
};
