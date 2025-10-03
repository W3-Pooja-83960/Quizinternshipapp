import { jwtDecode } from "jwt-decode";

export function getCurrentUser() {
  const token = localStorage.getItem("token");
  const adminData = localStorage.getItem("admin");

  if (token) {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  }

  if (adminData) {
    try {
      return JSON.parse(adminData); // return fake admin
    } catch (error) {
      console.error("Invalid admin data:", error);
      return null;
    }
  }

  return null;
}
