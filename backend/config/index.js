module.exports = {
  // 🔹 Database Credentials
  HOST: "localhost",
  USERNAME: "root",       // your MySQL username
  PASSWORD: "manager", // replace with your actual MySQL password
  DATABASE: "quiz", 
  DB_PORT:3306,        // your database name
  PORT: 8000,               // server port

  // 🔹 Table Names
  STUDENT_QUIZ_TABLE: "StudentQuiz",
  BATCH_TABLE: "batch",
  BATCH_COURSE_TABLE: "batch_course",
  COURSE_TABLE: "course",
  COURSE_MODULE_TABLE: "course_module",
  MODULE_TABLE: "module",
  OPTIONS_TABLE: "options",
  QUESTIONS_TABLE: "questions",
  QUIZ_TABLE: "quiz",
  STAFF_TABLE: "staff",
  STUDENT_ANSWER_TABLE: "studentAnswer",
  STUDENT_GROUP_TABLE: "student_group",
  STUDENTS_TABLE: "students"
};