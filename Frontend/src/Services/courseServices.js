import axios from "axios";
import { BASE_URL } from "../Config"; // Adjust the path to your config

// GET all courses with field mapping
async function fetchAllCourses() {
  try {
    const response = await axios.get(`${BASE_URL}/course/all-course`);

    // Map backend fields to frontend expected fields
    const formatted = Array.isArray(response.data)
      ? response.data.map((course) => ({
          id: course.course_id,
          name: course.course_name || "(Unnamed)",
        }))
      : [];

    return formatted;
  } catch (error) {
    console.error("Error in fetchAllCourses:", error);
    throw error;
  }
}

// POST new course
async function addCourse(courseData) {
  try {
    const response = await axios.post(`${BASE_URL}/course/add-course`, courseData);
    return response.data;
  } catch (error) {
    console.error("Error in addCourse:", error);
    throw error;
  }
}

// PUT update course
async function updateCourse(id, courseData) {
  try {
    const response = await axios.put(`${BASE_URL}/course/update-course/${id}`, courseData);
    return response.data;
  } catch (error) {
    console.error("Error in updateCourse:", error);
    throw error;
  }
}

// DELETE course
async function deleteCourse(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/course/delete-course/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in deleteCourse:", error);
    throw error;
  }
}

const courseService = {
  fetchAllCourses,
  addCourse,
  updateCourse,
  deleteCourse,
};

export default courseService;
