import axios from "axios";
import { BASE_URL } from "../Config";

 async function fetchAllBatches() {
  console.log("BASE_URL: ", BASE_URL);
  try {
    const response = await axios.get(`${BASE_URL}/batch/all-batch`);
    return response.data;
  } catch (error) {
    console.log("error: ", error);
  }
}

 // Add a new batch
async function addBatch(batchData) {
  console.log("BASE_URL: ", BASE_URL);
  try {
    const response = await axios.post(`${BASE_URL}/batch/add-batch`, batchData);
    return response.data;
  } catch (error) {
    console.log("error in addBatch: ", error);
    throw error;
  }
}

// Update an existing batch
async function updateBatch(id, batchData) {
  console.log("BASE_URL: ", BASE_URL);
  try {
    const response = await axios.put(`${BASE_URL}/batch/update-batch/${id}`, batchData);
    return response.data;
  } catch (error) {
    console.log("error in updateBatch: ", error);
    throw error;
  }
}

// Delete a batch
async function deleteBatch(id) {
  console.log("BASE_URL: ", BASE_URL);
  try {
    const response = await axios.delete(`${BASE_URL}/batch/delete-batch/${id}`);
    return response.data;
  } catch (error) {
    console.log("error in deleteBatch: ", error);
    throw error;
  }
}


// Export all functions as a single object
const batchServices = {
  fetchAllBatches,
  addBatch,
  updateBatch,
  deleteBatch,
};

export default batchServices;