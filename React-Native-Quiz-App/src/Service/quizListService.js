import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const BASE_URL = "http://192.168.2.35:5000";

// fetch quizzes assigned to a group
export const fetchAssignedQuizzes = async (groupName) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("Token missing");

    const res = await axios.get(
      `${BASE_URL}/quiz/assigned-quizzes/${groupName}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
  } catch (err) {
    console.error("Error in fetchAssignedQuizzes:", err.message);
    throw err;
  }
};

// optional: fetch student's attempted quizzes
export const fetchStudentResults = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("Token missing");

    const res = await axios.get(`${BASE_URL}/assignedQuiz/student-results`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err) {
    console.error("Error in fetchStudentResults:", err.message);
    return { data: [] };
  }
};