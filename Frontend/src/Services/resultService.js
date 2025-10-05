import axios from "axios";
import { BASE_URL } from "../Config";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

async function fetchResults(filters = {}) {
  try {
    const params = new URLSearchParams(filters).toString();
    const url = params
      ? `${BASE_URL}/students-results/view-results?${params}`
      : `${BASE_URL}/students-results/view-results`;

    const response = await axios.get(url, { headers: getAuthHeaders() });

    // ⚡ Check backend format: status vs success
    if (response.data.status === "success") return response.data.data;
    console.warn("API error:", response.data.error);
    return [];
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert(error.response.data.error || "Unauthorized! Redirecting to login.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    console.error("Fetch results error:", error);
    return [];
  }
}

export default { fetchResults };
