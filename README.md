Quiz App

A full-stack Quiz Application with Backend (Node.js + MySQL) and Frontend (React/React Native).  
This app allows admins/staff to create quizzes, students to attempt them, and results to be stored in a MySQL database.

------------------------------------------------------------------------------

Features
	- User authentication (students & staff)
	- Admin/staff can create quizzes and assign to student group
	- Students can take quizzes with a timer
	- Results stored in MySQL database
	- Responsive frontend (React) and React Native app

-------------------------------------------------------------------------------

Tech Stack
	 Frontend: React (Vite) / React Native
	 Backend: Node.js, Express.js
	 Database: MySQL

---------------------------------------------------------------------------------

 Setup Instructions

1. Clone the Repository

	git clone https://github.com/W3-Pooja-83960/Quizinternshipapp.git
	cd Quizinternshipapp


2. Database Setup (MySQL)-
	Make sure MySQL is installed and running.

	1. Create the quiz database:
	       mysql -u root -p -e "CREATE DATABASE quiz;"

	2. Import the database schema and data:
	       mysql -u root -p quiz < backend/quiz.sql
	       
	      Replace root with your MySQL username if needed.
	
3. Backend Setup
	cd backend
	npm install
	npm start
	
	Backend runs on: http://localhost:5000  
	
4.Frontend Setup (React)
	cd frontend
	npm install
	npm run dev
	
	Frontend runs on: http://localhost:5173
	
5. React Native App
	cd React-Native-Quiz-App
	npm install
	npx expo start
	
	install Expo Go from playstore to ur mobile

