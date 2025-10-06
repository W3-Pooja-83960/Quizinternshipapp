import axios from "axios";
import { BASE_URL } from "../Config";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

export async function fetchAllCourses() {
  try {
    const res = await axios.get(`${BASE_URL}/course/all-course`, {
      headers: getAuthHeaders(),
    });

    if (res.data.status === "success") {
      return res.data.data;
    } else {
      console.warn("API error:", res.data.error);
      return [];
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert(error.response.data.error || "Unauthorized! Redirecting to login.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    console.error("Fetch courses error:", error);
    return [];
  }
}

export async function addCourse(courseData) {
  try {
    const response = await axios.post(`${BASE_URL}/course/add-course`, courseData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Add course error:", error);
    return null;
  }
}

export async function updateCourse(id, courseData) {
  try {
    const response = await axios.put(`${BASE_URL}/course/update-course/${id}`, courseData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Update course error:", error);
    return null;
  }
}

export async function deleteCourse(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/course/delete-course/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Delete course error:", error);
    return null;
  }
}



export default {
  fetchAllCourses,
  addCourse,  
  updateCourse,
  deleteCourse,
};