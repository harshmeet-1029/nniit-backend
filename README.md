# Smart Flashcard Backend

A scalable backend for a smart flashcard system using Express.js, MongoDB, and a context-aware rule-based subject classifier. Designed for class 1–10 subjects, with robust security and easy extensibility.

---

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [1. Install Node.js](#1-install-nodejs)
  - [2. Install Yarn](#2-install-yarn)
  - [3. Install MongoDB](#3-install-mongodb)
    - [Option A: Local MongoDB](#option-a-local-mongodb)
    - [Option B: MongoDB Atlas (Cloud)](#option-b-mongodb-atlas-cloud)
    - [MongoDB Compass (GUI) [Recommended]](#mongodb-compass-gui-recommended)
- [Project Setup](#project-setup)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Extending the Subject Classifier](#extending-the-subject-classifier)
- [Troubleshooting](#troubleshooting)

---

## Features
- Add flashcards with automatic subject inference (covers all major subjects from class 1–10)
- Retrieve mixed flashcards by subject for a student, with pagination and shuffling
- Secure, production-ready setup (helmet, express-rate-limit, CORS)
- Highly optimized and extensible subject classifier (phrase-first, then keyword matching)
- Request logging and centralized error handling

---

## Project Structure
```
nniit-backend/
│
├── src/
│   ├── server.js                    # Entry point: loads env, connects DB, starts server
│   ├── app.js                       # Express app setup (helmet, rate limiter, routes, error handler)
│   ├── db/
│   │   └── index.js                 # MongoDB connection logic
│   ├── models/
│   │   └── flashcard.model.js       # Mongoose schema for flashcards
│   ├── routes/
│   │   └── flashcard.route.js       # Flashcard endpoints (POST/GET)
│   ├── utils/
│   │   └── subjectClassifier.util.js# Optimized subject classifier
│
├── .env                             # Environment variables (MongoDB URI, PORT)
├── package.json
├── yarn.lock
└── README.md                        # Project documentation
```

---

## Prerequisites
- **Node.js** (v18 or later recommended)
- **Yarn** (package manager)
- **MongoDB** (local or cloud)

---

## Installation

### 1. Install Node.js
- Download and install Node.js from [nodejs.org](https://nodejs.org/)
- Verify installation:
  ```bash
  node -v
  npm -v
  ```

### 2. Install Yarn
- Install Yarn globally:
  ```bash
  npm install -g yarn
  ```
- Verify installation:
  ```bash
  yarn -v
  ```

### 3. Install MongoDB

#### Option A: Local MongoDB
- Download MongoDB Community Server from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- Install and follow the setup instructions for your OS
- Start the MongoDB server:
  - On Windows: Run `mongod` from the command prompt
  - On macOS/Linux: Run `mongod` in your terminal
- By default, MongoDB runs at `mongodb://127.0.0.1:27017`

#### Option B: MongoDB Atlas (Cloud)
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account
- Create a new cluster (free tier is fine)
- Add a database user and set a password
- Whitelist your IP address (or allow access from anywhere for development)
- Get your connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority`)

#### MongoDB Compass (GUI) [Recommended]
- [MongoDB Compass](https://www.mongodb.com/products/compass) is a free, official GUI for MongoDB.
- Download and install Compass from [mongodb.com/products/compass](https://www.mongodb.com/products/compass).
- Use Compass to visually explore, query, and manage your MongoDB data.
- You can connect Compass to your local MongoDB (`mongodb://127.0.0.1:27017`) or to your Atlas cluster (paste your connection string).
- Compass is highly recommended for beginners to easily view and edit your database collections and documents.

---

## Project Setup
1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nniit-backend
   ```
2. **Install dependencies**
   ```bash
   yarn install
   ```

---

## Environment Variables
Create a `.env` file in the project root:
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string_here
```
- For local MongoDB, use: `MONGODB_URI=mongodb://127.0.0.1:27017/nniit-flashcards`
- For Atlas, use the connection string you copied from the Atlas dashboard

---

## Running the Server
- **Development (with auto-reload):**
  ```bash
  yarn nodemon src/server.js
  ```
- **Production:**
  ```bash
  node src/server.js
  ```
- The server will start at [http://localhost:8000](http://localhost:8000)

---

## API Endpoints

### 1. Add Flashcard (with Subject Inference)
- **POST** `/api/v1/flashcards/flashcard`
- **Body:**
  ```json
  {
    "student_id": "stu001",
    "question": "What is Newton's Second Law?",
    "answer": "Force equals mass times acceleration"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Flashcard added successfully",
    "subject": "Physics"
  }
  ```
- **Test with curl:**
  ```bash
  curl -X POST http://localhost:8000/api/v1/flashcards/flashcard \
    -H "Content-Type: application/json" \
    -d '{
      "student_id": "stu001",
      "question": "What is Newton'\''s Second Law?",
      "answer": "Force equals mass times acceleration"
    }'
  ```

### 2. Get Mixed Flashcards by Subject
- **GET** `/api/v1/flashcards/get-subject?student_id=stu001&limit=5`
- **Response:**
  ```json
  [
    {
      "question": "What is Newton's Second Law?",
      "answer": "Force equals mass times acceleration",
      "subject": "Physics"
    },
    {
      "question": "What is photosynthesis?",
      "answer": "A process used by plants to convert light into energy",
      "subject": "Biology"
    }
  ]
  ```
- **Test with curl:**
  ```bash
  curl "http://localhost:8000/api/v1/flashcards/get-subject?student_id=stu001&limit=5"
  ```

---

## Extending the Subject Classifier
- To add more subjects or keywords/phrases, edit `src/utils/subjectClassifier.util.js`.
- Add new entries to the `SUBJECT_PHRASES` and `SUBJECT_KEYWORDS` maps.
- The classifier checks for phrases first, then keywords, and always assigns a subject (never "General").

---

## Troubleshooting
- **MongoDB connection errors:**
  - Make sure MongoDB is running (local) or your Atlas URI is correct.
  - Check your `.env` file for typos.
- **Port already in use:**
  - Change the `PORT` in your `.env` file or stop the process using the port.
- **Other issues:**
  - Check the logs in your terminal for error messages.
  - Ensure all dependencies are installed with `yarn install`.
