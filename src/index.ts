import app from "./app";
import swaggerDocs from "./swagger";
import { validateEnvironment } from "./config/validateEnv";

validateEnvironment();

const port = process.env.PORT ? +process.env.PORT : 8080;
console.log({ port });
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  swaggerDocs(app, port);
});

export default app;
