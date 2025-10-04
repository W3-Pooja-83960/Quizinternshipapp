
import axios from "axios";


const BASE_URL = "http://192.168.2.35:5000";

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
