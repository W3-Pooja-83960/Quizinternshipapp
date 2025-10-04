import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


const BASE_URL = "http://192.168.2.35:5000";

export const fetchStudentResults = async () => {
  const token = await AsyncStorage.getItem("authToken");
  if (!token) throw new Error("No token found");

  const res = await axios.get(`${BASE_URL}/assignedQuiz/student-results`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("API response:", res.data);
  return res.data.data || [];
};
