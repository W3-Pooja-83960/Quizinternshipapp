// src/Service/registerService.js
import axios from "axios";
import { BASE_URL } from "../Service/api";


export const registerStudent = async (firstName, lastName, email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/student-register`, {
      firstName,
      lastName,
      email,
      password,
    });
    return response.data;
  } catch (err) {
    console.log(
      "Registration error:",
      err.response ? err.response.data : err.message
    );
    throw err.response ? err.response.data : { status: "error", message: err.message };
  }
};
