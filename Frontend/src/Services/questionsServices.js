import axios from "axios";
import { BASE_URL } from "../Config";

// Get Authorization headers
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

// Upload questions via file (CSV/Excel)
const uploadQuestions = async (file, quiz_id) => {
  if (!quiz_id) throw new Error("quiz_id is required for uploading questions");

  const formData = new FormData();
  formData.append("file", file);

  const url = `${BASE_URL}/questionApi/upload?quiz_id=${quiz_id}`;

  try {
    const res = await axios.post(url, formData, {
      headers: { 
        "Content-Type": "multipart/form-data",
        ...getAuthHeaders()
      }
    });
    return res.data;
  } catch (err) {
    console.error("Error uploading questions:", err);
    throw err;
  }
};

// Fetch all questions for a specific quiz
const fetchQuestionsByQuiz = async (quiz_id) => {
  if (!quiz_id) throw new Error("quiz_id is required to fetch questions");

  try {
    const res = await axios.get(`${BASE_URL}/questionApi/by-quiz/${quiz_id}`, {
      headers: getAuthHeaders()
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching questions:", err);
    throw err;
  }
};

// Add a single question manually
const addQuestion = async (quiz_id, questionData) => {
  if (!quiz_id) throw new Error("quiz_id is required to add a question");

  const payload = { ...questionData, quiz_id };

  try {
    const res = await axios.post(`${BASE_URL}/questions/add`, payload, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      }
    });
    return res.data;
  } catch (err) {
    console.error("Error adding question:", err);
    throw err;
  }
};

export default {
  uploadQuestions,
  fetchQuestionsByQuiz,
  addQuestion
};
