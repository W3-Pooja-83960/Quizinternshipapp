import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // Adjust port if needed

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const getStudents = async () => {
  const res = await api.get("/students/all-students");
  return res.data.data; // 👈 returns only array of students
};

export const createStudent = (data) => api.post("/students/add-student", data);
export const updateStudent = (id, data) =>
  api.put(`/students/update-student/${id}`, data);
export const deleteStudent = (id) =>
  api.delete(`/students/delete-student/${id}`);

// optional if you have them
export const getCourses = async () => {
  const res = await api.get("/course/all-course");
  return res.data.data;
};

export const getBatches = async (token) => {
  const res = await api.get("/batch/all-batch", {
    headers: {
      authorization: `Bearer ${token}`, 
    }
  });
  return res.data.data;
};

export default api;