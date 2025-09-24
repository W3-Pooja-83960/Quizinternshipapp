import axios from "axios";
import { BASE_URL } from "../Config"; 

// Register user
async function register(userData) {
  try {
    const response = await axios.post(`${BASE_URL}/user/register`, userData);
    return response.data; 
  } catch (error) {
    console.error("Registration failed:", error);
    return { status: "error", message: error.message };
  }
}

// Login user
// async function login(email, password) {
//   try {
//     const response = await axios.post(`${BASE_URL}/user/login`, { email, password });
    
//     // Check if login was successful
//     if (response.data.status === "success" && response.data.data?.token) {
//       const token = response.data.data.token;
//       localStorage.setItem("token", token);  // <-- Save token
//       console.log("Token saved:", token);
//     }

//     return response.data; // { status, data: { user, token }, message }
//   } catch (error) {
//     console.error("Login failed:", error);
//     return { status: "error", message: error.message };
//   }
// }


async function login(email, password) {
  try {
    const response = await axios.post(`${BASE_URL}/user/login`, { email, password });
    return response.data; // let the component decide what to do with data
  } catch (error) {
    console.error("Login failed:", error);
    return { status: "error", message: error.message };
  }
}

// const loginServices = {
//   register,
//   login
// };

// export default loginServices;

const loginServices = { login };
export default loginServices;