import express from 'express';
import router from './routes';

const app = express();

app.use(express.json());  // Middleware for parsing JSON
app.use('/', router);     // Use your defined routes

export default app;
