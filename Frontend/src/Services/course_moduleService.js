import axios from "axios";
import { BASE_URL } from "../Config";

// Helper function to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

// Fetch all course modules
async function fetchAllCourseModules() {
  try {
    const response = await axios.get(`${BASE_URL}/course_module/all-course_module`, {
      headers: getAuthHeaders(),
    });

    if (response.data.status === "success") {
      return response.data.data || [];
    } else {
      console.warn("API error:", response.data.error);
      return [];
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert(error.response.data.error || "Unauthorized! Redirecting to login.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return [];
  }
}

// Fetch modules for a specific course
async function fetchModulesByCourse(courseId) {
  try {
    const response = await axios.get(`${BASE_URL}/course_module/course/${courseId}/modules`, {
      headers: getAuthHeaders(),
    });

    if (response.data.status === "success") {
      return response.data.data || [];
    } else {
      console.warn("API error:", response.data.error);
      return [];
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert(error.response.data.error || "Unauthorized! Redirecting to login.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return [];
  }
}

// Add a new course module
async function addCourseModule(courseModuleData) {
  const response = await axios.post(`${BASE_URL}/course_module/add-course_module`, courseModuleData, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

// Update a course module
async function updateCourseModule(updateData) {
  const response = await axios.put(`${BASE_URL}/course_module/update-course_module`, updateData, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

// Delete a course module
async function deleteCourseModule(course_id, module_id) {
  const response = await axios.delete(`${BASE_URL}/course_module/delete-course_module/${course_id}/${module_id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

// Export all functions
export default {
  fetchAllCourseModules,
  fetchModulesByCourse,
  addCourseModule,
  updateCourseModule,
  deleteCourseModule,
};
