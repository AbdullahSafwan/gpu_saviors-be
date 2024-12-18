import app from "./app";
import swaggerDocs from "./swagger";

const port = Number(process.env.PORT) || 8080;
console.log({ port });
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);

  swaggerDocs(app, port);
});

export default app;
