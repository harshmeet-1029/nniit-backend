import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// Load environment variables from .env file
dotenv.config({ path: "./.env" });

// Connect to MongoDB and start the server
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("App error: ", error);
      throw error;
    });

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`-->>> Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed !!! ", err);
  });
