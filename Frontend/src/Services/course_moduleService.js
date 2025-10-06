import axios from "axios";
import { BASE_URL } from "../Config";

// ===== Auth Headers =====
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

// ===== Fetch all modules (with assigned courses) =====
async function fetchAllModules() {
  try {
    const res = await axios.get(`${BASE_URL}/course_module/get-all-modules`, { headers: getAuthHeaders() });
    return res.data.status === "success" ? res.data.data || [] : [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

// ===== Fetch a module by ID =====
async function fetchModuleById(module_id) {
  try {
    const res = await axios.get(`${BASE_URL}/course_module/modules/${module_id}`, { headers: getAuthHeaders() });
    return res.data.status === "success" ? res.data.data || null : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// ===== Add a new module =====
async function addModule(data) {
  try {
    const res = await axios.post(`${BASE_URL}/course_module/add-module`, data, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    console.error(err);
    return { status: "error", error: err };
  }
}


// ===== Update a module =====
async function updateModule(module_id, data) {
  try {
    const res = await axios.put(`${BASE_URL}/course_module/update-module/${module_id}`, data, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    console.error(err);
    return { status: "error", error: err };
  }
}

// ===== Delete a module =====
async function deleteModule(module_id) {
  try {
    const res = await axios.delete(`${BASE_URL}/course_module/delete-module/${module_id}`, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    console.error(err);
    return { status: "error", error: err };
  }
}

// ===== Fetch modules by course =====
async function fetchModulesByCourse(course_id) {
  try {
    const res = await axios.get(`${BASE_URL}/course_module/course/${course_id}/modules`, { headers: getAuthHeaders() });
    return res.data.status === "success" ? res.data.data || [] : [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

// ===== Assign module to course =====
async function assignModuleToCourse(data) {
  try {
    const res = await axios.post(`${BASE_URL}/course_module/assign-module-to-course`, data, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    console.error(err);
    return { status: "error", error: err };
  }
}

// ===== Unassign module from course =====
async function unassignModuleFromCourse(data) {
  try {
    // Use DELETE with data in axios
    const res = await axios.delete(`${BASE_URL}/course_module/delete-assigned-module`, { data, headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    console.error(err);
    return { status: "error", error: err };
  }
}

export default {
  fetchAllModules,
  fetchModuleById,
  addModule,
  updateModule,
  deleteModule,
  assignModuleToCourse,
  unassignModuleFromCourse,
  fetchModulesByCourse
};
