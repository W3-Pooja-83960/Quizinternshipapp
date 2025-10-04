import axios from "axios";
import { BASE_URL } from "../Config";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

// GET all staff
const getAllStaff = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/staff/all-staff`, {
      headers: getAuthHeaders(),
    });

    if (response.data.status === "success") {
      return response.data.data;
    } else {
      console.warn("API error:", response.data.error);
      return response.send(successResponse([]));
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert(error.response.data.error || "Unauthorized! Redirecting to login.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return [];
  }
};

// Add a new staff
const addStaff = async (staffData) => {
  const response = await axios.post(`${BASE_URL}/staff/add`, staffData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Update staff by ID
const updateStaff = async (id, staffData) => {
  const response = await axios.put(`${BASE_URL}/staff/update/${id}`, staffData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Delete staff by ID
const deleteStaff = async (id) => {
  const response = await axios.delete(`${BASE_URL}/staff/delete/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

const staffService = {
  getAllStaff,
  addStaff,
  updateStaff,
  deleteStaff,
};

export default staffService;
