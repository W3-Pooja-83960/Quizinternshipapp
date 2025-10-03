// src/Services/quizServices.js
import axios from "axios";
import { BASE_URL } from "../Config";

const buildUrl = (path) => `${BASE_URL}/quiz${path}`;

// Get JWT token headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // JWT saved in localStorage
  return { Authorization: `Bearer ${token}` };
};

// Fetch all quizzes
async function fetchAllQuizzes() {
  console.log("Fetching all quizzes from:", buildUrl("/all-quiz"));
  try {
    const response = await axios.get(buildUrl("/all-quiz"), { headers: getAuthHeaders() });
    if (response.data?.status === "success" && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Error in fetchAllQuizzes:", error.response?.data || error.message);
    return [];
  }
}

// Add a new quiz
async function addQuiz(quizData) {
  // Convert empty strings to null and numbers to actual Number type
  const payload = {
    ...quizData,
    staff_id: quizData.staff_id ? Number(quizData.staff_id) : null,
    course_id: quizData.course_id ? Number(quizData.course_id) : null,
  };

  console.log("Adding new quiz (processed):", payload);

  try {
    const response = await axios.post(buildUrl("/add-quiz"), payload, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error("Error in addQuiz:", error.response?.data || error.message);
    throw error;
  }
}


// Update a quiz
async function updateQuiz(id, quizData) {
  console.log("Updating quiz:", id, quizData);
  try {
    const response = await axios.put(buildUrl(`/update-quiz/${id}`), quizData, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error("Error in updateQuiz:", error.response?.data || error.message);
    throw error;
  }
}

// Delete a quiz (soft delete)
async function deleteQuiz(id) {
  console.log("Deleting quiz:", id);
  try {
    const response = await axios.delete(buildUrl(`/delete-quiz/${id}`), { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error("Error in deleteQuiz:", error.response?.data || error.message);
    throw error;
  }
}

// // Assign quiz to group
// const assignQuiz = async (formData) => {
//   try {
//     const response = await axios.post(
//       `${BASE_URL}/assigned_quiz/assign-quiz-to-group`,
//       formData,
//       { headers: getAuthHeaders() }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error assigning quiz:", error.response?.data || error.message);
//     throw error;
//   }
// };
// Assign quiz to group
export const sendQuizToGroup = async ({ quiz_id, group_name }) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${BASE_URL}/quiz/send-quiz-to-group`,
      { quiz_id, group_name },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    console.error("Error sending quiz to group:", err.response?.data || err.message);
    throw err;
  }
};

// Fetch question count for a single quiz
export const fetchQuestionCount = async (quiz_id) => {
  const res = await axios.get(`${BASE_URL}/quiz/${quiz_id}/question-count`, {
    headers: getAuthHeaders(),
  });
  return res.data; // { count: <number> }
};


 
// Fetch question count with headers
export const fetchAllQuestionCounts = async () => {
  const res = await axios.get(`${BASE_URL}/quiz/question-counts`, {
    headers: getAuthHeaders(),
  });
  return res.data.data; // returns object { quiz_id: count, ... }
};

const quizServices = {
  fetchAllQuizzes,
  addQuiz,
  updateQuiz,
  deleteQuiz,
  sendQuizToGroup,
  fetchQuestionCount,
  fetchAllQuestionCounts
};

export default quizServices;
