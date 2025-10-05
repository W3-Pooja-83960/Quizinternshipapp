import React, { useState, useEffect } from "react";
import resultsServices from "../Services/resultService";
import courseService from "../Services/courseServices"; 
import quizService from "../Services/quizServices";
import "../Styles/results.css";

export default function Results() {
  const [results, setResults] = useState([]);
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [filters, setFilters] = useState({ course_id: "", group_name: "", quiz_id: "" });
  const [loading, setLoading] = useState(true);

  const [groups] = useState(["W1","W2","D1","D2","B1","B2","A1","A2","E1","E2"]);

  const loadCoursesQuizzes = async () => {
    const courseData = await courseService.fetchAllCourses();
    setCourses(courseData || []);

    const quizData = await quizService.fetchAllQuizzes();
    setQuizzes(quizData || []);
  };

  const loadResults = async () => {
    setLoading(true);
    const data = await resultsServices.fetchResults(filters);
    setResults(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadCoursesQuizzes();
    loadResults(); // initial load
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = () => loadResults();
  const handleResetFilters = () => {
    setFilters({ course_id: "", group_name: "", quiz_id: "" });
    loadResults({ course_id: "", group_name: "", quiz_id: "" });
  };

  if (loading) return <p>Loading results...</p>;

  return (
    <div className={`result-container ${results.length === 0 ? "result-no-results" : ""}`}>
      <h2 className="result-heading">Student Results</h2>

      {/* Filters */}
      <div className="result-filters">
        <select
          name="course_id"
          value={filters.course_id}
          onChange={handleFilterChange}
          className="result-select"
        >
          <option value="">Select Course</option>
          {courses.map(c => (
            <option key={c.course_id} value={c.course_id}>
              {c.course_name}
            </option>
          ))}
        </select>

        <select
          name="group_name"
          value={filters.group_name}
          onChange={handleFilterChange}
          className="result-select"
        >
          <option value="">Select Group</option>
          {groups.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        <select
          name="quiz_id"
          value={filters.quiz_id}
          onChange={handleFilterChange}
          className="result-select"
        >
          <option value="">Select Quiz</option>
          {quizzes.map(q => (
            <option key={q.quiz_id} value={q.quiz_id}>
              {q.quiz_title}
            </option>
          ))}
        </select>

        <button className="result-btn-green" onClick={handleFilterSubmit}>
          Filter
        </button>
        <button className="result-btn-red" onClick={handleResetFilters}>
          Reset
        </button>
      </div>

      {/* Results Table or No Data */}
      {results.length === 0 ? (
        <p className="result-no-data">No data found.</p>
      ) : (
        <table className="result-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Course</th>
              <th>Group</th>
              <th>Quiz Title</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, idx) => (
              <tr key={idx}>
                <td>{r.firstName} {r.lastName}</td>
                <td>{r.course_name}</td>
                <td>{r.group_name}</td>
                <td>{r.quiz_title}</td>
                <td>{r.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
