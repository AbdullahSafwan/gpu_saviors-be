import express from "express";
import router from "./routes";
import { requestLogger, errorLogger } from "./middleware/requestLogger";
import logger from "./utils/logger";
import { setupMonitoring } from "./utils/monitoring";
import path from "path";
import fs from "fs";

// Initialize monitoring
setupMonitoring();

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const app = express();

// Request logging middleware
app.use(requestLogger);

app.use(express.json()); // Middleware for parsing JSON

// Log all unhandled errors
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`Unhandled error: ${err.message}`);
  logger.error(err.stack);
  next(err);
});

// Routes
app.use("/", router);

// Error logging middleware (should be after routes)
app.use(errorLogger);

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).json({
    error: {
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { details: err.message }),
    }
  });
});

export default app;
