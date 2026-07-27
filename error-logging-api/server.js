import express from "express";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Error Logging API is Running 🚀");
});

app.get("/error", (req, res, next) => {
  const error = new Error("Something went wrong!");
  next(error);
});

app.use(errorHandler);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});