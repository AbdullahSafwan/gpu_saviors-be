import express from "express";
import cors from "cors";
import router from "./routes";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { sendErrorResponse } from "./services/responseHelper";

const app = express();

// Trust proxy - IMPORTANT for cloud deployments behind reverse proxy/load balancer
// This allows Express to trust the X-Forwarded-* headers
app.set('trust proxy', true);

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Cache-Control"]
}));

// Rate limiting - General API limiter
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "300"),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`[RATE LIMIT] IP ${req.ip} exceeded rate limit - ${req.method} ${req.path}`);
    res.status(429).json({
      error: "Too many requests",
      message: "You have exceeded the rate limit. Please try again later.",
    });
  },
  skip: (req) => {
    // Skip rate limiting for health check
    return req.path === "/health";
  }
});
app.use(limiter);

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || "900000"),
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || "10"),
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    console.error(`[AUTH RATE LIMIT] IP ${req.ip} exceeded auth rate limit - ${req.method} ${req.path}`);
    sendErrorResponse(res, 429, "Too many authentication attempts. Please try again later")
  }
});

// Apply strict limiter to auth routes
app.use("/auth/login", authLimiter);

// Debug middleware - logs client IPs (remove after confirming it works)
if (process.env.NODE_ENV === "development") {
  app.use((req, _res, next) => {
    console.log(`[DEBUG] Client IP: ${req.ip}, X-Forwarded-For: ${req.headers['x-forwarded-for']}`);
    next();
  });
}

// HTTP request logger middleware
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Body parser with size limits
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Health check endpoint for load balancer
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Routes
app.use("/", router);

export default app;
