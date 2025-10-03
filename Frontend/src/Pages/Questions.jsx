import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // import useNavigate
import { BASE_URL } from "../Config";
import "../Styles/questions.css";

export default function Questions() {
  const { quiz_id } = useParams();
  const navigate = useNavigate(); // initialize navigate
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState({
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "",
    marks: 1,
  });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleCSVUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select a CSV or Excel file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/questionApi/upload?quizId=${quiz_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(res.data?.data?.message || "Upload success");
      setFile(null);
      document.querySelector('input[type="file"]').value = "";
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const handleManualAdd = async (e) => {
    e.preventDefault();
    if (!["A", "B", "C", "D"].includes(question.correct_answer)) {
      return alert("Correct answer must be A, B, C, or D");
    }

    try {
      const payload = {
        quiz_id,
        question_text: question.question_text,
        option_a: question.option_a,
        option_b: question.option_b,
        option_c: question.option_c,
        option_d: question.option_d,
        answer: question.correct_answer,
        marks: Number(question.marks) || 1,
      };

      const res = await axios.post(`${BASE_URL}/questions/add`, payload);
      alert(res.data?.data?.message || "Question added");

      setQuestion({
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_answer: "",
        marks: 1,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add question");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestion((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="questions-container">
      <h2>Add Questions (Quiz ID: {quiz_id})</h2>

      <div className="upload-section">
        <form onSubmit={handleCSVUpload}>
          <input type="file" accept=".csv, .xls, .xlsx" onChange={handleFileChange} />
          <button type="submit">Upload File</button>
        </form>
      </div>

      <form onSubmit={handleManualAdd} className="question-form">
        <textarea
          name="question_text"
          placeholder="Question"
          value={question.question_text}
          onChange={handleInputChange}
          required
        />
        <input type="text" name="option_a" placeholder="Option A" value={question.option_a} onChange={handleInputChange} />
        <input type="text" name="option_b" placeholder="Option B" value={question.option_b} onChange={handleInputChange} />
        <input type="text" name="option_c" placeholder="Option C" value={question.option_c} onChange={handleInputChange} />
        <input type="text" name="option_d" placeholder="Option D" value={question.option_d} onChange={handleInputChange} />

        <select name="correct_answer" value={question.correct_answer} onChange={handleInputChange} required>
          <option value="">Select Correct Answer</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>

        <input type="number" name="marks" placeholder="Marks" value={question.marks} onChange={handleInputChange} min={1} />

        <div className="form-buttons">
          <button  type="submit" className="question-add-question">Add Question</button>

          <button className="question-back-button" type="button" onClick={() => navigate("/quizzes")} // Back to Quiz page
          >   Back to Quizzes   </button>
        </div>
      </form>
    </div>
  );
}
