import express from "express";
import router from "./routes";
import morgan from "morgan";

const app = express();

app.use(morgan("combined")); // HTTP request logger middleware

app.use(express.json()); // Middleware for parsing JSON
app.use("/", router); // Use your defined routes

export default app;
