Quiz App-
	A full-stack Quiz Application with Backend (Node.js + MySQL) and Frontend (React/React Native).  
This app allows admins/staff to create quizzes, students to attempt them, and results to be stored in a MySQL database.



Features
	- User authentication (students & staff)
	- Admin/staff can create quizzes and assign to student group
	- Students can take quizzes with a timer
	- Results stored in MySQL database
	- Responsive frontend (React) and React Native app



Tech Stack
	 Frontend: React (Vite) / React Native
	 Backend: Node.js, Express.js
	 Database: MySQL
	 
	 Other Tools: Postman, github

-------------------------------------------------------------------------------------------------
# Backend 

This is the backend of Quiz App built with **Node.js**, **Express**, and **MySQL**.  
It handles operations for staff, batches, courses, modules, authentication, and file uploads.

---

## Features

- REST APIs for CRUD operations (Staff, Batches, Courses, Modules)
- User authentication using **JWT**
- Password hashing using **bcryptjs**
- File uploads using **multer**
- CSV and Excel file processing (`csv-parser`, `xlsx`)
- Database operations using **MySQL2**
- Notifications for frontend via API responses

---

## Installation / Setup

1. **Clone the repository**
	git clone <your-repo-url>

2 . Navigate to the backend folder
	cd backend

3.Install dependencies
	npm install
	
4.Configure database and secrets
	Create a file config/index.js (or use .env) with your credentials:

		const HOST = "localhost";
		const USERNAME = "root";
		const PASSWORD = "yourpassword";
		const DATABASE = "your_database";
		const JWT_SECRET = "your_jwt_secret";

		module.exports = { HOST, USERNAME, PASSWORD, DATABASE, JWT_SECRET };

5.Start the server
	npm start
	The server will run on http://localhost:5000 (default port).

*Database Configuration
		db/db.js sets up the MySQL connection pool and exports a query helper for async operations:
		Table names are also defined in db.js or imported from config/index.js.


*Scripts
npm start → Starts the server


*Dependencies-
	Key packages used:
		-express – Web framework
		-mysql2 – MySQL driver
		-bcryptjs – Password hashing
		-jsonwebtoken – JWT authentication
		-cors – Cross-Origin requests
		-multer – File uploads
		-csv-parser – CSV processing
		-xlsx – Excel file handling
		-react-datepicker – Date picker (if frontend integrated)

*Usage-
Start the server.
Connect via Postman or frontend to test APIs.
Example endpoints:
GET /staff → List all staff
POST /staff → Add new staff
PUT /staff/:id → Update staff
DELETE /staff/:id → Delete staff

You can similarly test batches, courses, and modules APIs.



---------------------------------------------------------------------------------------------------
Frontend-


This is the frontend of Quiz App built with **React**, **Vite**, **Bootstrap**, and **React Router**.
It connects to the backend APIs for managing staff, batches, courses, modules, and authentication.

---

## Features

- Single Page Application (SPA) using **React** and **Vite**
- Routing with **React Router DOM**
- HTTP requests using **Axios**
- JWT-based authentication with **jwt-decode**
- Responsive UI with **Bootstrap**
- Form validation and notifications
- Supports CRUD operations via backend APIs

---

## Installation / Setup

1. **Clone the repository**
	git clone <your-frontend-repo-url>
	
2 .Navigate to the frontend folder
	cd frontend
	
3.Install dependencies
	npm install

4.Start the development server
	npm run dev
The frontend will run on http://localhost:5173 (default Vite port).


*Scripts
	npm run dev → Starts the development server
	npm run build → Builds the production bundle
	npm run preview → Previews the production build
	npm run lint → Runs ESLint to check code quality

*Dependencies
	react – Frontend library
	react-dom – React DOM rendering
	react-router-dom – Routing
	axios – HTTP requests
	bootstrap – UI framework
	jwt-decode – Decode JWT tokens on client side
	Dev Dependencies
	vite – Development server and build tool
	@vitejs/plugin-react – Vite plugin for React
	eslint, @eslint/js – Linting
	eslint-plugin-react-hooks, eslint-plugin-react-refresh – Lint rules for React

Usage
	1. Start the development server: npm run dev.
	2. pen your browser at http://localhost:5173.
	3. Login using JWT-based authentication and interact with backend APIs.
	4. Perform CRUD operations on staff, batches, courses, and modules through UI.



---------------------------------------------------------------------------------------------------------------

React-Native App

# QuizApp

A mobile quiz application built with **React Native** and **Expo**, featuring user authentication and 
exam functionality. This app allows students to give quizzes and displays the result.

---


## Features

	-User Authentication – JWT-based login for secure access.
	-Quiz Management – Quizzes set by the admin are displayed to students on their Home page.
	-Quiz Timer – Each quiz includes a countdown timer.
	-Immediate Results – Students see their results immediately after submitting a quiz.
	-Token Management – Uses async storage for storing and managing authentication tokens.
	-Beautiful UI – Enhanced interface with React Native Vector Icons and Expo Linear Gradient for a modern, polished look.
---

## Installation

1. Make sure you have **Node.js** and **Expo CLI** installed. 
   Install 'Expo Go' app from playstore to your mobile(android) 
   
   Install Expo CLI globally if not installed:
	   npm install -g expo-cli
	   
2.Clone this repository:
	git clone <your-repo-url>
	cd quizapp

3.Install dependencies:
	npm install
	
*Usage-
-Start the Expo project:

# Start development server
npx expo start

on mobile -scan the QR code you received after running the project

*Dependencies-
	@react-native-async-storage/async-storage ^2.2.0
	@react-navigation/bottom-tabs ^7.4.7
	@react-navigation/native ^7.1.17
	@react-navigation/native-stack ^7.3.26
	axios ^1.12.2
	expo ~54.0.10
	expo-status-bar ~3.0.8
	jwt-decode ^4.0.0
	react 19.1.0
	react-native ^0.81.4
	react-native-safe-area-context ^5.6.1
	react-native-screens ^4.16.0
	react-native-vector-icons ^10.3.0
	expo-linear-gradient ~15.0.7

*Dev Dependencies-
	@react-native-community/cli ^20.0.2
	@react-native/metro-config ^0.80.2



License
This project is private.





















# QuizApplication-web-App-
