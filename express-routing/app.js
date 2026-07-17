const express =require("express");
const cors =require("cors");
const logger =require("./middleware/logger");
const app =express();
const userRoutes =require("./routes/userRoutes");

app.use(cors());
app.use(express.json());
app.use(logger);
app.use("/users", userRoutes);
app.get("/error", (req, res, next) => {
    const err = new Error("Testing Error");
    next(err);
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        message: "Route Not Found"
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        message: "Something went wrong"
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});