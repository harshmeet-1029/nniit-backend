import express from "express";
import Flashcard from "../models/flashcard.model.js";
import { detectSubject } from "../utils/subjectClassifier.util.js";

const router = express.Router();

// POST /flashcard - Add a flashcard with subject inference
router.post("/flashcard", async (req, res, next) => {
  try {
    // Destructure required fields from request body
    const { student_id, question, answer } = req.body;

    // Validate required fields
    if (!student_id || !question || !answer) {
      // If any required field is missing, return 400 Bad Request
      return res.status(400).json({
        success: false,
        message: "student_id, question, and answer are required.",
      });
    }

    // Infer the subject from the question using the subject classifier utility
    const subject = detectSubject(question);

    // Create a new flashcard document in the database
    const flashcard = await Flashcard.create({
      student_id,
      question,
      answer,
      subject,
    });

    // Respond with success message and the inferred subject
    return res
      .status(201)
      .json({ message: "Flashcard added successfully", subject });
  } catch (err) {
    // Pass any errors to the centralized error handler
    next(err);
  }
});

// GET /get-subject?student_id=...&limit=...
router.get("/get-subject", async (req, res, next) => {
  try {
    const { student_id, limit } = req.query;

    if (!student_id) {
      return res
        .status(400)
        .json({ success: false, message: "student_id is required." });
    }

    let result;

    if (!limit) {
      // No limit provided: fetch all flashcards for this student
      result = await Flashcard.find({ student_id });
    } else {
      const lim = Math.max(1, parseInt(limit, 10) || 5);

      // Randomly sample 'lim' flashcards
      result = await Flashcard.aggregate([
        { $match: { student_id } },
        { $sample: { size: lim } },
      ]);
    }

    // If nothing is found
    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No flashcards found for student_id '${student_id}'.`,
      });
    }

    const response = result.map((card) => ({
      question: card.question,
      answer: card.answer,
      subject: card.subject,
    }));

    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
