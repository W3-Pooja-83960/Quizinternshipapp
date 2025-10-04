import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../Service/api";



// Start attempt
export const startAttempt = async (quizId, studentId, groupName) => {
  const token = await AsyncStorage.getItem("authToken");
  const res = await axios.post(
    `${BASE_URL}/assignedQuiz/start-attempt`,
    { student_id: studentId, quiz_id: quizId, group_name: groupName },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data; // attempt_id
};

// Fetch questions
export const fetchQuestionsByQuiz = async (quizId) => {
  const token = await AsyncStorage.getItem("authToken");
  const res = await axios.get(`${BASE_URL}/assignedQuiz/questions/${quizId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // array of questions
};

// Submit answers
export const submitAnswers = async (attemptId, quizId, answers) => {
  const token = await AsyncStorage.getItem("authToken");
  const res = await axios.post(
    `${BASE_URL}/assignedQuiz/submit-answers`,
    { attempt_id: attemptId, quiz_id: quizId, answers },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data; // obtained_score, total_score
};
