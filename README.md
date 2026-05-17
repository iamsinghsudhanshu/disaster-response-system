# 🛡️ DisasterReady — AI Disaster Preparedness System

A full-stack disaster preparedness platform with quizzes, video learning, emergency guides and analytics dashboard.

**Stack:** React 18 + Vite + Framer Motion + Recharts (Frontend) | Spring Boot 3.2.5 + JWT + BCrypt (Backend) | MySQL (Database)

---

## 📁 Project Structure

```
DisasterResponseSystem/
├── backend/                          Spring Boot REST API
│   ├── src/main/java/com/disaster/
│   │   ├── BackendApplication.java
│   │   ├── config/                   JWT + Security + CORS
│   │   ├── controller/               Auth, Scenario, Question, Attempt, Admin
│   │   ├── dto/                      Request/Response DTOs
│   │   ├── model/                    User, Scenario, Question, QuizAttempt
│   │   ├── repository/               JPA repositories
│   │   └── service/                  Business logic
│   └── src/main/resources/
│       ├── application.properties    DB config, JWT secret
│       └── data.sql                  120 questions (20 per scenario)
│
└── frontend/                         React + Vite SPA
    ├── public/_redirects             Netlify routing fix
    ├── vercel.json                   Vercel routing fix
    ├── vite.config.js                Dev proxy + build config
    └── src/
        ├── App.jsx                   Routes + auth guards
        ├── context/AuthContext.jsx   Auth state + dashboardVersion
        ├── utils/api.js              Axios + all API calls
        ├── components/               Navbar, Footer
        └── pages/
            ├── Home.jsx              Landing page
            ├── Login.jsx             Login with demo credentials
            ├── Signup.jsx            Registration + password strength
            ├── Scenarios.jsx         6 disaster scenario cards
            ├── Quiz.jsx              20-question quiz with timer
            ├── Dashboard.jsx         Analytics, charts, badges
            ├── VideoLearning.jsx     18 YouTube videos with tracking
            ├── EmergencyGuide.jsx    Before/During/After checklists
            ├── AdminDash.jsx         Question CRUD + stats
            └── NotFound.jsx          404 page
```

---

## 🚀 How to Run Locally

### Step 1 — MySQL Setup
```sql
-- Either let Spring Boot auto-create:
-- (spring.datasource.url includes createDatabaseIfNotExist=true)

-- Or create manually:
CREATE DATABASE disaster_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Edit credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=root   ← change to your MySQL password
```

### Step 2 — Start Backend
```bash
cd DisasterResponseSystem/backend
mvn clean spring-boot:run
```
✅ Runs on http://localhost:8080  
✅ Auto-creates tables on first run  
✅ Seeds 120 questions + admin user from data.sql  

### Step 3 — Start Frontend
```bash
cd DisasterResponseSystem/frontend
npm install
npm run dev
```
✅ Runs on http://localhost:5173  
✅ API calls proxied to :8080 automatically  

---

## 🔑 Default Login Credentials

| Role  | Email                 | Password   |
|-------|-----------------------|------------|
| Admin | admin@disaster.com    | admin123   |
| User  | Register via /signup  | any 6+ chars |

---

## 🌐 Deployment Guide

### Frontend — Deploy to Netlify (Free)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Go to https://netlify.com → "Add new site" → "Deploy manually"

3. Drag the `frontend/dist/` folder into Netlify

4. Set environment variable in Netlify dashboard:
```
VITE_API_URL = https://your-backend-url.com
```

5. Update `frontend/src/utils/api.js` baseURL:
```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})
```

The `public/_redirects` file already handles React Router SPA routing on Netlify.

### Frontend — Deploy to Vercel (Free)

1. Push code to GitHub

2. Go to https://vercel.com → "New Project" → Import your repo

3. Set framework to "Vite"

4. Add environment variable: `VITE_API_URL = https://your-backend-url.com`

The `vercel.json` already handles SPA routing.

### Backend — Deploy to Railway (Free tier available)

1. Go to https://railway.app → "New Project" → "Deploy from GitHub"

2. Select your repo → choose the `backend` folder

3. Railway auto-detects Spring Boot and builds with Maven

4. Add environment variables in Railway dashboard:
```
SPRING_DATASOURCE_URL      = jdbc:mysql://your-db-host:3306/disaster_db
SPRING_DATASOURCE_USERNAME = your_db_user
SPRING_DATASOURCE_PASSWORD = your_db_password
JWT_SECRET                 = YourLongSecretKeyHere
```

5. Railway provides a free MySQL plugin — add it to your project

### Backend — Deploy to Render (Free tier)

1. Go to https://render.com → "New Web Service"

2. Connect GitHub repo, set root directory to `backend`

3. Build command: `mvn clean package -DskipTests`

4. Start command: `java -jar target/backend-0.0.1-SNAPSHOT.jar`

5. Add environment variables same as Railway above

### Update CORS for Production

After deployment, add your frontend URL to `SecurityConfig.java`:
```java
config.setAllowedOrigins(Arrays.asList(
    "http://localhost:5173",
    "http://localhost:3000",
    "https://your-app.netlify.app",    ← add your deployed frontend URL
    "https://your-app.vercel.app"      ← add your deployed frontend URL
));
```

---

## 📡 API Endpoints

| Method | Endpoint                          | Auth     | Description              |
|--------|-----------------------------------|----------|--------------------------|
| POST   | /api/auth/signup                  | Public   | Register new user        |
| POST   | /api/auth/login                   | Public   | Login, returns JWT       |
| GET    | /api/scenarios                    | Public   | All disaster scenarios   |
| GET    | /api/scenarios/{id}/questions     | Public   | Questions for a scenario |
| POST   | /api/questions                    | ADMIN    | Add a question           |
| PUT    | /api/questions/{id}               | ADMIN    | Update a question        |
| DELETE | /api/questions/{id}               | ADMIN    | Delete a question        |
| POST   | /api/attempts                     | USER     | Save quiz result         |
| GET    | /api/attempts/user/{userId}       | USER     | Get user quiz history    |
| GET    | /api/admin/stats                  | ADMIN    | Dashboard KPIs           |
| GET    | /api/admin/users                  | ADMIN    | List all users           |

---

## 🏆 Features

- **120 Quiz Questions** — 20 per disaster scenario (Flood, Earthquake, Fire, Cyclone, Landslide, Tsunami)
- **30-second Timer** per question with visual countdown
- **Live Dashboard** — updates instantly after quiz, video watch, or guide read
- **Progress Charts** — bar chart, pie chart, line trend (Recharts)
- **10 Achievement Badges** — quiz count, perfect score, videos watched, guides read
- **Video Learning** — 18 curated YouTube videos with watch tracking
- **Emergency Guides** — Before/During/After/Kit checklists for all 6 disasters
- **JWT Authentication** — BCrypt passwords, role-based access (USER/ADMIN)
- **Admin Dashboard** — CRUD questions, view stats, manage scenarios
- **Fully Responsive** — mobile, tablet, desktop
- **Glassmorphism UI** — gradients, animations, Framer Motion throughout

---

## 🔧 Troubleshooting

**Backend: "Only 1 question per scenario"**
→ Run `mvn clean spring-boot:run` (the `clean` phase deletes old compiled classes)
→ Ensure `application.properties` has `spring.sql.init.mode=always`

**Backend: SecurityConfig startup error**
→ Always compile fresh with `mvn clean spring-boot:run`
→ Never run from VS Code's cached `.class` files after replacing source

**Frontend: API calls failing**
→ Ensure backend is running on port 8080
→ `vite.config.js` proxy handles `/api` → `localhost:8080` in dev
→ In production, set `VITE_API_URL` environment variable

**MySQL connection refused**
→ Check MySQL is running: `sudo systemctl start mysql`
→ Verify credentials in `application.properties`
→ Database auto-created if `createDatabaseIfNotExist=true` is in the URL
