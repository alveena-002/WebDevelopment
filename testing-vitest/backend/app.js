import express from "express";
import helloRoute from "./routes/hello.js";

const app = express();

app.use(express.json());

app.use("/", helloRoute);

export default app;