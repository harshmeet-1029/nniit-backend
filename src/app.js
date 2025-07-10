import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import flashcardRouter from "./routes/flashcard.route.js";

export const app = express();

// Security HTTP headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: "*", // Adjust as needed for production
    credentials: true,
  })
);

// Logging
app.use(morgan("dev"));

// Cookie parser
app.use(cookieParser());

// Body parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Rate Limiter
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 500, // Limit each IP to 500 requests per window
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);

// Flashcard routes
app.use("/api/v1/flashcards", flashcardRouter);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Backend is UP" });
});

// Centralized error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const stack = process.env.NODE_ENV === "development" ? err.stack : undefined;

  return res.status(statusCode).json({
    success: false,
    message,
    ...(stack && { stack }),
  });
});
