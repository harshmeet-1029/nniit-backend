# Smart Flashcard Backend

A scalable backend for a smart flashcard system using Express.js, MongoDB, and a rule-based subject classifier.

## Features
- Add flashcards with automatic subject inference (Physics, Biology, Chemistry, Math, etc.)
- Retrieve mixed flashcards by subject for a student, with pagination and shuffling
- Secure, production-ready setup (helmet, rate limiting, CORS)
- Highly optimized and extensible subject classifier

## Project Structure
```
src/
  server.js
  app.js
  db/
    index.js
  models/
    flashcard.model.js
  routes/
    flashcard.route.js
  utils/
    subjectClassifier.util.js
.env
README.md
```

## Setup
1. **Clone the repository**
2. **Install dependencies**
   ```bash
   yarn install
   ```
3. **Configure environment variables**
   - Create a `.env` file in the root directory:
     ```env
     PORT=8000
     MONGODB_URI=your_mongodb_connection_string_here
     ```
   - Set your MongoDB URI. The default port is 8000.
4. **Run the server**
   - For development (with auto-reload):
     ```bash
     yarn nodemon src/server.js
     ```
   - For production:
     ```bash
     node src/server.js
     ```

## API Endpoints

### Add Flashcard (with Subject Inference)
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

### Get Mixed Flashcards by Subject
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

## Notes
- The subject classifier is rule-based and can be extended in `src/utils/subjectClassifier.util.js`.
- Make sure MongoDB is running and accessible from your connection string.

---

**For any issues, please check your .env configuration and MongoDB connection.**
