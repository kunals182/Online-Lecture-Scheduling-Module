 Online Lecture Scheduling Module

This is my MERN stack submission for the assignment. It's a full-stack web application designed for scheduling lectures, managing courses, and preventing overlapping schedules for instructors.

Live Project Link: https://online-lecture-scheduling-module-t3z3.onrender.com
Video Walkthrough: https://drive.google.com/file/d/1guVlzhVRAXyGzBV01WtfeL-X7tv2llsa/view?usp=sharing

---

HOW TO TEST IT

Admin Login:
Email: admin@test.com
Password: password123

Instructor Login:
Use the credentials you create for them in the Admin Panel. 
(If you don't enter a custom password during creation, it defaults to: instructor123)

---

TECH STACK
- Frontend: React (Vite) with standard CSS.
- Backend: Node.js, Express.js.
- Database: MongoDB Atlas. 
Note: The database connection string is in the env file, and I've also provided the database dump json file as requested.

---

API ROUTES

User Routes
GET /api/users/instructors - list of instructors
POST /api/users - add an instructor
POST /api/users/login - auth

Course Routes
GET /api/courses - list courses
POST /api/courses - create course

Lecture Routes 
GET /api/lectures/all/lectures - full schedule
GET /api/lectures/:instructorId - schedule for one instructor
POST /api/lectures - assign lecture (this handles the clash validation logic)

---

LOCAL SETUP
1. Run "npm install" inside the backend folder and then "npm start".
2. Open a new terminal, run "npm install" inside the frontend folder, then "npm run dev".
3. Open your local host URL to view it locally.
