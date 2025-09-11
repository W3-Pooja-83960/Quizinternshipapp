batch-

//1-get all batch
get-http://localhost:5000/batch/all-batch

//2-get batch by id
get-http://localhost:5000/batch/2

//3.add batch
post-http://localhost:5000/batch/add-batch
body-{   "batch_id": "12",
  "batch_name": "Batch A",
  "start_date": "2025-09-01",
    "end_date":"2026-01-09"
}

//4.update batch
put-http://localhost:5000/batch/update-batch/12
{
  "batch_name": "batch b",
  "start_date": "2025-09-01",
  "end_date": "2025-12-31"
}

//5.delete batch by id
delet-http://localhost:5000/batch/delete-batch/12

==========================================================================================================
course-

//1. get all courses
get-http://localhost:5000/course/all-course

//2. add course
post- http://localhost:5000/course/add-course
body-{
    "course_id":"6001",
    "course_name": "abcd"
}

//3.update course by id
put-http://localhost:5000/course/update-course/6001
body-{
    "course_name":"xyz"
}

//4.delete course by id
delete-http://localhost:5000/course/delete-course/6001

=====================================================================================================================
studentquiz table-

//1.get all quiz attempts
get-http://localhost:5000/student-quiz/all-quiz/1

//2.get specific quiz
get-http://localhost:5000/student-quiz/stud-quiz/1/1

//3.get specific question
get-http://localhost:5000/student-quiz/1/quiz/1/questions

//4.add new quiz attempt
post-http://localhost:5000/student-quiz/add-quiz-attempt/
body-{
  "student_id": 1,
  "quiz_id": 1,
  "answers": [
    { "question_id": 1, "is_correct": 1 },
    { "question_id": 2, "is_correct": 0 }
  ]
}

//5-update ans
Put-http://localhost:5000/student-quiz/update-answer

body-{
  "attempt_id": 2,
  "question_id": 2,
  "is_correct": 1
}

//6-delete
http://localhost:5000/student-quiz/delete/1

//7- add multiple answers
post-http://localhost:5000/student-answers/add-multiple-ans

body-{
  "answers": [
    { "attempt_id": 3, "questions_id": 1, "is_correct": 1 },
    { "attempt_id": 3, "questions_id": 2, "is_correct": 0 },
    { "attempt_id": 3, "questions_id": 3, "is_correct": 1 }
  ]
}
==============================================================================================
studentanswer table-

//1 get student answer
get-http://localhost:5000/student-answers/stud-answers/1/1

//2-post-add single ans
post-http://localhost:5000/student-answers/stud-ans/add-single-ans

body-{
  "attempt_id": 2,
  "questions_id": 3,
  "is_correct": 1
}

//3-post-add multiple ans
post-http://localhost:5000/student-answers/add-multiple-ans

body-{
  "answers": [
    { "attempt_id": 2, "questions_id": 1, "is_correct": 1 },
    { "attempt_id": 2, "questions_id": 2, "is_correct": 0 },
    { "attempt_id": 2, "questions_id": 3, "is_correct": 1 }
  ]
}

//4-update ans
put-http://localhost:5000/student-answers/update/5

body- {
  "attempt_id": 2,
  "questions_id": 3,
  "is_correct": 1
}

--------------------------------------
admin routes

//PUT-update stud records,batch,course
http://localhost:5000/students-admin/update-student-record/2
body-{
    "batch_id": "3"
}

//add multiple students to batch
post-http://localhost:5000/student_batch_admin/assign-students-to-batch
