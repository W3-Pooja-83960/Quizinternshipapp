import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../Service/api";


export const loginStudent = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/student-login`, {
      email,
      password,
    });
    if (response.data.status === "success") {
      const { token, user } = response.data.data;
      await AsyncStorage.setItem("token", token); 
      await AsyncStorage.setItem("user", JSON.stringify(user));
    }
    return response.data;
  } catch (err) {
    console.log("Login error:", err.response ? err.response.data : err.message);
    throw err.response ? err.response.data : { status: "error", message: err.message };
  }
};
