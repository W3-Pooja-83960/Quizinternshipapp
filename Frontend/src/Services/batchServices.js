import axios from "axios";
import { BASE_URL } from "../Config";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

async function fetchAllBatches() {
  try {
    const response = await axios.get(`${BASE_URL}/batch/all-batch`, {
      headers: getAuthHeaders(),
    });

    if (response.data.status === "success") {
      return response.data.data;
    } else {
      console.warn("API error:", response.data.error);
      return [];
    }
  } catch (error) {
    // Redirect to login if unauthorized
    if (error.response && error.response.status === 401) {
      alert(error.response.data.error || "Unauthorized! Redirecting to login.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return [];
  }
}

// Add
async function addBatch(batchData) {
  const response = await axios.post(`${BASE_URL}/batch/add-batch`, batchData, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

//update
async function updateBatch(id, batchData) {
  const response = await axios.put(`${BASE_URL}/batch/update-batch/${id}`, batchData, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

//delete
async function deleteBatch(id) {
  const response = await axios.delete(`${BASE_URL}/batch/delete-batch/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
}

export default {
  fetchAllBatches,
  addBatch,
  updateBatch,
  deleteBatch,
};
