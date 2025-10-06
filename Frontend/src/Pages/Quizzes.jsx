import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import quizServices from "../Services/quizServices";
import AllServices from "../Services/AllServices";
import "../Styles/quizzes.css";

export default function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const groupNames = ["W1", "W2","D1","D2","B1","B2","A1","A2","E1","E2"];

  const [formData, setFormData] = useState({
    quiz_title: "",
    duration: "",
    marks: "",
    module_id: "",
    staff_id: "",
    course_id: "",
    group_name: "",
    is_active: 1,
  });

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  // Load initial data
  useEffect(() => {
    loadQuizzes();
    loadDropdownData();
  }, []);

  // Fetch quizzes + question count
  const loadQuizzes = async () => {
    try {
      const data = await quizServices.fetchAllQuizzes();
      const counts = await quizServices.fetchAllQuestionCounts(); // { quiz_id: count }

      const quizzesWithCount = data.map(q => ({
        ...q,
        questionCount: counts[q.quiz_id] || 0
      }));

      setQuizzes(quizzesWithCount);
    } catch (err) {
      console.error("Failed to load quizzes:", err);
    }
  };

  const loadDropdownData = async () => {
    setCourses(await AllServices.fetchAllCourses());
    setModules(await AllServices.fetchAllModules());
    setStaffs(await AllServices.fetchAllStaffs());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await quizServices.updateQuiz(editingId, formData);
      else await quizServices.addQuiz(formData);

      resetForm();
      loadQuizzes();
    } catch (err) {
      console.error("Error saving quiz:", err);
      alert("Failed to save quiz");
    }
  };

  const resetForm = () => {
    setFormData({
      quiz_title: "",
      duration: "",
      marks: "",
      module_id: "",
      staff_id: "",
      course_id: "",
      group_name: "",
      is_active: 1,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (quiz) => {
    setFormData(quiz);
    setEditingId(quiz.quiz_id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      await quizServices.deleteQuiz(id);
      loadQuizzes();
    }
  };

  const handleAddQuestions = (quizId) => navigate(`/questions/${quizId}`);
  const handleViewQuestions = (quizId) => navigate(`/view-questions/${quizId}`);

  const handleSendToGroup = async (quiz) => {
    if (!quiz.group_name) return alert("Select a group first in the quiz form");

    try {
      const res = await quizServices.sendQuizToGroup({
        quiz_id: quiz.quiz_id,
        group_name: quiz.group_name,
      });

      if (res.status === "success") alert("Quiz sent to group successfully!");
      else alert(res.message);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send quiz to group");
    }
  };

  return (
    <div className="quiz-table-container">
      <h2>Quiz Management</h2>
      <div className="quiz-header">
        {/* Updated Add Quiz button */}
        <button
          className="quiz-add-button"
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              quiz_title: "",
              duration: "",
              marks: "",
              module_id: "",
              staff_id: "",
              course_id: "",
              group_name: "",
              is_active: 1,
            });
          }}
        >
          Add Quiz
        </button>
      </div>

      {showForm && (
        <form className="quiz-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="quiz_title"
            placeholder="Quiz Title"
            value={formData.quiz_title}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="duration"
            placeholder="Duration (min)"
            value={formData.duration}
            onChange={handleChange}
          />
          <input
            type="number"
            name="marks"
            placeholder="Marks"
            value={formData.marks}
            onChange={handleChange}
          />

          <select name="course_id" value={formData.course_id} onChange={handleChange}>
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c.course_id} value={c.course_id}>{c.course_name}</option>
            ))}
          </select>

          <select name="module_id" value={formData.module_id} onChange={handleChange}>
            <option value="">Select Module</option>
            {modules.map((m) => (
              <option key={m.module_id} value={m.module_id}>{m.module_name}</option>
            ))}
          </select>

          <select name="staff_id" value={formData.staff_id} onChange={handleChange}>
            <option value="">Select Staff</option>
            {staffs.map((s) => (
              <option key={s.staff_id} value={s.staff_id}>
                {s.firstName} {s.lastName}
              </option>
            ))}
          </select>

          <select name="group_name" value={formData.group_name} onChange={handleChange}>
            <option value="">Select Group</option>
            {groupNames.map((g, idx) => (
              <option key={idx} value={g}>{g}</option>
            ))}
          </select>

          <div className="form-buttons">
            <button type="submit" className="quiz-submit-button">
              {editingId ? "Update Quiz" : "Add Quiz"}
            </button>
            <button type="button" className="quiz-cancel-button" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <table className="quiz-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Quiz Title</th>
            <th>Duration</th>
            <th>Marks</th>
            <th>Course</th>
            <th>Module</th>
            <th>Staff</th>
            <th>Group</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.length > 0 ? (
            quizzes.map((q) => (
              <tr key={q.quiz_id}>
                <td>{q.quiz_id}</td>
                <td>{q.quiz_title}</td>
                <td>{q.duration}</td>
                <td>{q.marks}</td>
                <td>{courses.find((c) => c.course_id === q.course_id)?.course_name}</td>
                <td>{modules.find((m) => m.module_id === q.module_id)?.module_name}</td>
                <td>{staffs.find((s) => s.staff_id === q.staff_id)?.firstName}{" "}
                  {staffs.find((s) => s.staff_id === q.staff_id)?.lastName}
                </td>
                <td>{q.group_name}</td>
                <td>{q.is_active ? "Active" : "Inactive"}</td>
                <td>
                  <button className="quiz-action-button" onClick={() => handleEdit(q)}>Edit</button>
                  <button className="quiz-action-button delete" onClick={() => handleDelete(q.quiz_id)}>Delete</button>
                  <button className="quiz-action-button-add-questions" onClick={() => handleAddQuestions(q.quiz_id)}>Add Questions</button>
                  <button className="btn view-questions" onClick={() => handleViewQuestions(q.quiz_id)}>View Questions</button>
                  <button
                    className="quiz-action-button assign"
                    onClick={() => handleSendToGroup(q)}
                    disabled={q.questionCount === 0}
                    title={q.questionCount === 0 ? "Add questions first" : ""}
                  >
                    Send to Group
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: "center" }}>No quizzes found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


