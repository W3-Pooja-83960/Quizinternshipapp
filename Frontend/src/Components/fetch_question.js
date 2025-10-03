// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function SelectQuestions({ moduleId }) {
//   const [questions, setQuestions] = useState([]);
//   const [selectedQuestions, setSelectedQuestions] = useState([]);

//   useEffect(() => {
//     if (!moduleId) return;
//     axios.get(`/api/questions/module/${moduleId}`)
//       .then(res => {
//         if(res.data.status === "success"){
//           setQuestions(res.data.data);
//         }
//       })
//       .catch(err => console.log(err));
//   }, [moduleId]);

//   const handleSelectQuestion = (id) => {
//     setSelectedQuestions(prev =>
//       prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
//     );
//   };

//   const handleAssignQuiz = () => {
//     // Call your assign quiz API with selectedQuestions
//     axios.post("/api/quizzes/assign", { selectedQuestions })
//       .then(res => alert(res.data.message))
//       .catch(err => console.log(err));
//   };

//   return (
//     <div>
//       <h3>Select Questions</h3>
//       {questions.map(q => (
//         <div key={q.question_id}>
//           <input
//             type="checkbox"
//             checked={selectedQuestions.includes(q.question_id)}
//             onChange={() => handleSelectQuestion(q.question_id)}
//           />
//           {q.question_text}
//         </div>
//       ))}

//       <button onClick={handleAssignQuiz} disabled={selectedQuestions.length === 0}>
//         Assign Quiz
//       </button>
//     </div>
//   );
// }
