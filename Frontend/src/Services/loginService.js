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
async function login(email, password) {
  try {
    const response = await axios.post(`${BASE_URL}/user/login`, { email, password });
    return response.data; 
  } catch (error) {
    console.error("Login failed:", error);
    return { status: "error", message: error.message };
  }
}


const loginServices = { 
                        login
                      };
                      
export default loginServices;