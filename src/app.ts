import express from "express";
import cors from "cors";
import router from "./routes";
import morgan from "morgan";

const app = express();

// CORS configuration to allow requests from any origin
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

app.use(morgan("combined")); // HTTP request logger middleware

app.use(express.json()); // Middleware for parsing JSON
app.use("/", router); // Use your defined routes

export default app;
