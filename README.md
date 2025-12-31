# BeyondChats – Full Stack Development Internship Assignment

This project was developed as part of the **BeyondChats Full Stack Development Internship assignment**.  
It demonstrates an end-to-end pipeline where blog articles are scraped, processed using AI, and visualized using a React frontend.

The project is divided into **three clear phases** as required in the assignment.

---

## 🛠 Tech Stack Used

### Backend

- Node.js
- Express.js
- MongoDB (Atlas)
- Axios
- Cheerio
- Serper.dev (Google Search API)

### AI / LLM

- Groq API (LLaMA 3 models)

### Frontend

- React
- Axios

---

## 📂 Project Structure

```
beyondchatsAssignmentHarithik/
│
├── beyondchats-backend/
│   ├── scraper/
│   ├── phase2/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── beyondchats-frontend/
│   ├── src/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

## 🧭 Architecture & Data Flow

The following diagram shows the complete end-to-end flow of the system across all three phases:

![Architecture Diagram](./diagrams/architecture-flow.png)

This diagram explains how articles are scraped, processed using AI, stored, and finally visualized in the frontend.

---

## 🔹 Phase 1 – Data Collection & Storage

- Scraped the **5 oldest blog articles** from BeyondChats.
- Extracted title, URL, and content.
- Stored all articles in MongoDB.
- Created REST APIs to fetch and update articles.

---

## 🔹 Phase 2 – AI Enhancement Pipeline

- Google search using Serper.dev
- Selected top 2 relevant external articles
- Scraped reference content
- Rewrote original articles using Groq LLM
- Handled token limits with smart truncation
- Stored AI-updated content and references in MongoDB

Articles with insufficient reference content are intentionally skipped.

---

## 🔹 Phase 3 – Frontend Visualization

- React frontend displays articles and status
- Click to view full content and references
- Clear UI guidance for users

---

## ▶️ How to Run

### Backend

```bash
cd beyondchats-backend
npm install
npm run dev
```

### Frontend

```bash
cd beyondchats-frontend
npm install
npm start
```

## ⚠️ Deployment Note

The frontend is deployed on Vercel for demonstration purposes.

The backend APIs (`Node.js + MongoDB`) are designed to run locally as per assignment scope.
Because of this, the live frontend may display "No articles found" unless the backend is running locally.

This does not affect the assignment functionality, which can be verified by running the backend locally.

---

## ✅ Assignment Status

All phases completed successfully.

---

Thank you for reviewing this assignment.
