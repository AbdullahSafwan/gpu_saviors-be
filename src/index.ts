import app from "./app";
import swaggerDocs from "./swagger";
import { validateEnvironment } from "./config/validateEnv";
import { initializeSchedulers } from "./schedulers";

validateEnvironment();

const port = process.env.PORT ? +process.env.PORT : 8080;
console.log({ port });
app.listen(port, async () => {
  console.log(`Server is running on port: ${port}`);
  swaggerDocs(app, port);

  try {
    await initializeSchedulers();
  } catch (error) {
    console.error("Failed to initialize schedulers. Server will continue without scheduled tasks:", error);
    throw error;
  }
});

export default app;
