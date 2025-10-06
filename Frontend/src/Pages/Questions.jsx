import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../Config";
import "../Styles/questions.css";

export default function Questions() {
  const { quiz_id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

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

  return (
    <div className="questions-container">
      <h2>Upload Questions for Quiz ID: {quiz_id}</h2>

      <div className="upload-section">
        <form onSubmit={handleCSVUpload}>
          <input type="file" accept=".csv, .xls, .xlsx" onChange={handleFileChange} />
          <button type="submit">Upload File</button>
        </form>
      </div>

      <button
        className="question-back-button"
        type="button"
        onClick={() => navigate("/quizzes")}
      >
        Back to Quizzes
      </button>
    </div>
  );
}
