# Lecture Scheduling Module

This is my MERN stack test assignment submission. I built an admin panel where
you can add courses, assign lectures to instructors and make sure no two lectures
clash on the same day for the same instructor.

## How to run it locally

You need Node.js and MongoDB installed. Make sure MongoDB is running first.

Backend:
  cd backend
  npm install
  npm start

Frontend (open a new terminal):
  cd frontend
  npm install
  npm run dev

Open browser at http://localhost:5173

## How to use the app

Note: Authentication was not Mentioned in  requirement Drive file That's why i have not implemented it. Role selection is used for demo purposes.

No login screen. When you open the app you'll see two options:
- Admin button to open the admin dashboard
- Instructor buttons if any instructors have been added

## What admin can do

- Add instructors by name
- Add courses with name, level, description and image
- Assign lecture batches to any course by picking instructor and date
- If same instructor is already booked on that date, it blocks and shows an error

## Instructor view

Click an instructor to see all their assigned lectures sorted by date with course name.

## API Routes

GET  /api/users/instructors         all instructors
POST /api/users                     add instructor
GET  /api/courses                   all courses
POST /api/courses                   add course
POST /api/lectures                  assign lecture (checks for clash)
GET  /api/lectures/:instructorId    lectures for one instructor

## Database

MongoDB at mongodb://localhost:27017/lecture-scheduler
Collections: users, courses, lectures
Database dump is at /backend/database-dump.json

