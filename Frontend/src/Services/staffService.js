// src/Services/staffService.js
import axios from "axios";
import { BASE_URL } from "../Config";

// Get all staff
const getAllStaff = async () => {
  const response = await axios.get(`${BASE_URL}/staff/all-staff`);
  return response.data;
};

// Add a new staff
const addStaff = async (staffData) => {
  const response = await axios.post(`${BASE_URL}/staff/add`, staffData);
  return response.data;
};

// Update staff by ID
const updateStaff = async (id, staffData) => {
  const response = await axios.put(`${BASE_URL}/staff/update/${id}`, staffData);
  return response.data;
};

// Delete staff by ID
const deleteStaff = async (id) => {
  const response = await axios.delete(`${BASE_URL}/staff/delete/${id}`);
  return response.data;
};

const staffService = {
  getAllStaff,
  addStaff,
  updateStaff,
  deleteStaff,
};

export default staffService;
