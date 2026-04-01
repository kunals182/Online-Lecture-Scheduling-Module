# Ideamagix - Review Test Assignment: Online Lecture Scheduling Module

This is a full-stack (MERN) assessment project designed to handle the core requirements of academic scheduling. It provides dedicated interfaces to add instructors, organize courses, and assign lecture batches while actively preventing schedule clashes.

## 🚀 Live Links & Demonstration

*   **Live Project URL**: `[INSERT_YOUR_HOSTING_LINK_HERE]` (e.g., https://your-project.netlify.app/)
*   **Video Walkthrough**: `[INSERT_GOOGLE_DRIVE_VIDEO_LINK_HERE]`

## 🔐 Credentials for Evaluation

| Role / Access | Email | Password |
| :--- | :--- | :--- |
| **Admin Dashboard** | `admin@test.com` | `password123` |
| **Instructor Panel** (Test User) | `[INSERT_CREATED_INSTRUCTOR_EMAIL_HERE]` | `[INSERT_CREATED_PASSWORD_HERE]` or `instructor123` |
| **MongoDB Atlas** | Database URI is available in the provided `.env` file or repository secrets. |

*(Note: The `instructor123` password is automatically assigned to any new instructor created by an Admin if a custom password isn't explicitly entered during onboarding.)*

## 📁 Project Architecture & Tech Stack

This project uses a standard monolithic MERN architecture consisting of:
*   **Database**: MongoDB (Atlas Cluster). A dump of the database is available at `database-dump.json` in the root backend directory.
*   **Backend**: Node.js & Express.js (RESTful API architecture).
*   **Frontend**: React (Vite) utilizing custom CSS for a premium "Cyber-Glass" aesthetic and responsive layouts.

## 🔗 Available API Routes

### User & Authentication (`/api/users`)
*   `POST /api/users/login` - Authenticates user (Admin or Instructor) and returns session details.
*   `GET /api/users/instructors` - Fetches a list of all registered instructors.
*   `POST /api/users` - Creates a new instructor profile.

### Course Management (`/api/courses`)
*   `GET /api/courses` - Retrieves the full course catalog.
*   `POST /api/courses` - Adds a new course to the curriculum.

### Lecture Scheduling (`/api/lectures`)
*   `GET /api/lectures/:instructorId` - Fetches all lectures assigned to a specific instructor.
*   `GET /api/lectures/all/lectures` - Retrieves the entire schedule across all users.
*   `POST /api/lectures` - Assigns a lecture. **Includes clash detection** (blocks if the instructor is already booked for that date).

## 💻 Local Development Setup

If you wish to test the application locally instead of using the provided live URL:

1.  **Clone the Repository** and navigate to the project directory.
2.  **Start the Backend**:
    ```bash
    cd backend
    npm install
    npm start
    ```
3.  **Start the Frontend**: Open a second terminal window.
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
4.  Navigate to `http://localhost:5173` in your browser.
