// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import questionService from "../Services/questionsServices";
// import "../Styles/viewQuestion.css";   

// const ViewQuestions = () => {
//   const { quizId } = useParams();
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState([]);

//   const loadQuestions = async () => {
//     try {
//       const result = await questionService.fetchQuestionsByQuiz(quizId);
//       setQuestions(Array.isArray(result) ? result : []);
//     } catch (err) {
//       console.error("Failed to fetch questions:", err);
//       alert("Failed to fetch questions.");
//     }
//   };

//   useEffect(() => {
//     loadQuestions();
//   }, [quizId]);

//   // ✅ return must be inside the function
//   return (
//     <div className="view-questions-container">
//       <h2 className="view-questions-title">Questions for Quiz ID: {quizId}</h2>

//       {questions.length === 0 ? (
//         <p className="view-questions-empty">No questions found.</p>
//       ) : (
//         <table className="view-questions-table">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Question Text</th>
//               <th>Options</th>
//               <th>Answer</th>
//             </tr>
//           </thead>
//           <tbody>
//             {questions.map((q, idx) => (
//               <tr key={q.question_id}>
//                 <td>{idx + 1}</td>
//                 <td>{q.question_text}</td>
//                 <td>
//                   A: {q.option_a || "-"} | B: {q.option_b || "-"} | C: {q.option_c || "-"} | D: {q.option_d || "-"}
//                 </td>
//                 <td className="view-questions-answer">{q.answer || "N/A"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       <button onClick={() => navigate("/Quizzes")} className="view-question-back-button"  >
//         Back to Quizzes
//       </button>
//     </div>
//   );
// };

// export default ViewQuestions;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import questionService from "../Services/questionsServices";
import "../Styles/viewQuestion.css";   

const ViewQuestions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);

  const loadQuestions = async () => {
    try {
      const result = await questionService.fetchQuestionsByQuiz(quizId);
      setQuestions(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      alert("Failed to fetch questions.");
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [quizId]);

  return (
    <div className="view-questions-container">
      <h2 className="view-questions-title">Questions for Quiz ID: {quizId}</h2>

      {questions.length === 0 ? (
        <p className="view-questions-empty">No questions found.</p>
      ) : (
        <table className="view-questions-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Option A</th>
              <th>Option B</th>
              <th>Option C</th>
              <th>Option D</th>
              <th>Answer</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, idx) => (
              <tr key={q.question_id}>
                <td>{idx + 1}</td>
                <td>{q.question_text}</td>
                <td>{q.option_a || "-"}</td>
                <td>{q.option_b || "-"}</td>
                <td>{q.option_c || "-"}</td>
                <td>{q.option_d || "-"}</td>
                <td className="view-questions-answer">{q.answer || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button 
        onClick={() => navigate("/Quizzes")} 
        className="view-question-back-button"
      >
        Back to Quizzes
      </button>
    </div>
  );
};

export default ViewQuestions;
