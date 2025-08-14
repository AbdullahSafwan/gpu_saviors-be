import express from "express";
import cors from "cors";
import router from "./routes";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100") // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// HTTP request logger middleware
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Body parser with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/", router);

export default app;
