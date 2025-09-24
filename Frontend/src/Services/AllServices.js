import axios from "axios";
import { BASE_URL } from "../Config";

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

async function fetchAllBatches() {
  try {
    const response = await axios.get(`${BASE_URL}/batch/all-batch`, {
      headers: { Authorization: `Bearer ${getToken()}` } // ✅ send token
    });
    return response.data?.data || [];
  } catch (error) {
    console.log("fetchAllBatches error:", error.response?.data || error.message);
    return [];
  }
}

async function fetchAllCourses() {
  try {
    const response = await axios.get(`${BASE_URL}/course/all-course`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return response.data?.data || [];
  } catch (error) {
    console.log("fetchAllCourses error:", error.response?.data || error.message);
    return [];
  }
}

async function fetchAllModules() {
  try {
    const response = await axios.get(`${BASE_URL}/module/all-module`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return response.data?.data || [];
  } catch (error) {
    console.log("fetchAllModules error:", error.response?.data || error.message);
    return [];
  }
}

async function fetchAllStudent_group() {
  try {
    const response = await axios.get(`${BASE_URL}/students_group/all`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    const groups = response.data?.data || [];

    // Filter distinct group names
    const distinctGroups = [];
    const seenNames = new Set();
    for (const g of groups) {
      if (!seenNames.has(g.group_name)) {
        seenNames.add(g.group_name);
        distinctGroups.push(g);
      }
    }
    return distinctGroups;
  } catch (error) {
    console.log("fetchAllStudent_group error:", error.response?.data || error.message);
    return [];
  }
}


async function fetchAllStaffs() {
  try {
    const response = await axios.get(`${BASE_URL}/staff/all-staff`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return response.data?.data || [];
  } catch (error) {
    console.log("fetchAllStaffs error:", error.response?.data || error.message);
    return [];
  }
}

async function fetchQuestionsByModule(module_id) {
  try {
    const response = await axios.get(`${BASE_URL}/questions/module/${module_id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return response.data?.data || [];
  } catch (error) {
    console.error("fetchQuestionsByModule error:", error.response?.data || error.message);
    return [];
  }
}

async function fetchAssignQuiz() {
  try {
    const response = await axios.get(`${BASE_URL}/assigned_quiz/assign-quiz`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return response.data?.data || [];
  } catch (error) {
    console.log("fetchAssignQuiz error:", error.response?.data || error.message);
    return [];
  }
}

async function fetchModulesByCourse(course_id) {
  try {
    const response = await axios.get(`${BASE_URL}/course_module/course/${course_id}/modules`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    return response.data?.data || [];
  } catch (error) {
    console.log("fetchModulesByCourse error:", error.response?.data || error.message);
    return [];
  }
}



const AllServices = {
  fetchAllBatches,
  fetchAllCourses,
  fetchAllModules,
  fetchAllStudent_group,
  fetchAllStaffs,
  fetchQuestionsByModule,
  fetchAssignQuiz,
  fetchModulesByCourse
};

export default AllServices;
