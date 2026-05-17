# 🛡️ DisasterReady — AI Disaster Preparedness System

A full-stack disaster preparedness and awareness platform built using React, Spring Boot, JWT Authentication, and MySQL.

The platform helps users learn disaster safety through:
- Interactive quizzes
- Emergency preparedness guides
- Video learning modules
- Analytics dashboards
- Admin management system

---

# 🚀 Tech Stack

## Frontend
- React 18
- Vite
- Axios
- Framer Motion
- Recharts
- React Router DOM

## Backend
- Spring Boot 3
- Spring Security
- JWT Authentication
- BCrypt Password Encryption
- Maven

## Database
- MySQL (Railway)

## Deployment
- Frontend → Vercel
- Backend → Render
- Database → Railway

---

# 📁 Project Structure

```bash
DisasterResponseSystem/
│
├── backend/
│   ├── src/main/java/com/disaster/
│   │   ├── config/
│   │   │   ├── JwtUtil.java
│   │   │   ├── SecurityConfig.java
│   │   │   └── DataInitializer.java
│   │   │
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   │
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── data.sql
│   │
│   ├── Dockerfile
│   ├── .dockerignore
│   └── pom.xml
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── context/
    │   └── utils/api.js
    │
    ├── vercel.json
    ├── vite.config.js
    └── package.json

✨ Features
👨‍🎓 User Features
User Signup/Login
JWT Authentication
Disaster Awareness Quizzes
20 Random Questions per Quiz
Quiz Timer
Dashboard Analytics
Progress Tracking
Emergency Safety Guides
Disaster Video Learning
👨‍💼 Admin Features
Admin Login
Add/Edit/Delete Questions
Manage Scenarios
View User Statistics
Dashboard Analytics

🌊 Disaster Scenarios
Flood
Earthquake
Fire
Cyclone
Tsunami
Landslide

🔐 Authentication
JWT Token Authentication
BCrypt Password Encryption
Role-Based Access Control
Protected Routes

🛠️ Local Setup
1️⃣ Clone Repository
git clone https://github.com/iamsinghsudhanshu/disaster-response-system.git

2️⃣ Backend Setup
cd backend

Configure MySQL

Update:

backend/src/main/resources/application.properties

Example:
spring.datasource.url=jdbc:mysql://localhost:3306/disaster_db
spring.datasource.username=root
spring.datasource.password=yourpassword

Run Backend
mvn clean spring-boot:run

Backend runs on:

http://localhost:8080

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs on:

http://localhost:5173

🌐 Production Deployment
🚀 Backend Deployment (Render)
Root Directory
backend
Environment Variables
SPRING_DATASOURCE_URL=jdbc:mysql://autorack.proxy.rlwy.net:41398/railway
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=YOUR_PASSWORD

JWT_SECRET=mySuperSecureJWTSecretKeyForDisasterResponseSystem2026

Dockerfile

Production-ready multi-stage Docker build included.

.dockerignore
target
node_modules
.git
.idea
.vscode
*.log

🚀 Frontend Deployment (Vercel)
Root Directory
frontend
Build Settings
Build Command: npm run build
Output Directory: dist
Install Command: npm install

Environment Variables
VITE_API_BASE_URL=https://disaster-response-backend-9r3w.onrender.com
🔧 Production Fixes Applied
✅ Fixed Vercel Production API Issue

Changed Axios baseURL to:

const BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api'
✅ Fixed JWT Secret Length Error

Updated JWT secret to secure 256-bit compatible key.

✅ Fixed Docker Deployment Errors
Removed dependency on mvnw
Added multi-stage Docker build
Fixed jar path issues
Added .dockerignore
✅ Fixed .map is not a function

Added safe array handling in:

Quiz.jsx
Dashboard.jsx
Scenarios.jsx

Example:

const qs = Array.isArray(qRes.data) ? qRes.data : []
✅ Fixed Admin Login

Created:

DataInitializer.java

Automatically creates admin user:

Email: admin@gmail.com
Password: admin123
📡 API Endpoints
Method	Endpoint	Description
POST	/api/auth/signup	User registration
POST	/api/auth/login	User login
GET	/api/scenarios	Get scenarios
GET	/api/scenarios/{id}/questions	Get quiz questions
POST	/api/attempts	Save quiz result
GET	/api/admin/stats	Admin statistics

📊 Dashboard Features
Quiz Analytics
Progress Charts
Attempt History
Performance Tracking
User Statistics
🎥 Learning Features
Disaster Awareness Videos
Emergency Guides
Safety Instructions
Preparedness Training

🌐 Live Demo
Frontend

https://disaster-response-system-two.vercel.app

Backend

https://disaster-response-backend-9r3w.onrender.com

👨‍💻 Author

Sudhanshu Singh

GitHub:
https://github.com/iamsinghsudhanshu

📜 License

This project is for educational and awareness purposes.
