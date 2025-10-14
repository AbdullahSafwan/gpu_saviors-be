import express from "express";
import cors from "cors";
import router from "./routes";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { sendErrorResponse } from "./services/responseHelper";

const app = express();

// trust the X-Forwarded-* headers
app.set("trust proxy", true);

app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Cache-Control"],
  })
);

// applying rate limit for general apis
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
  },
});
app.use(limiter);

// strict api limit for login api
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || "900000"),
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || "10"),
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    console.error(`[AUTH RATE LIMIT] IP ${req.ip} exceeded auth rate limit - ${req.method} ${req.path}`);
    sendErrorResponse(res, 429, "Too many authentication attempts. Please try again later");
  },
});

app.use("/auth/login", authLimiter);

// logs client IP if dev
if (process.env.NODE_ENV === "development") {
  app.use((req, _res, next) => {
    console.log(`[DEBUG] Client IP: ${req.ip}, X-Forwarded-For: ${req.headers["x-forwarded-for"]}`);
    next();
  });
}

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

app.use("/", router);

export default app;
