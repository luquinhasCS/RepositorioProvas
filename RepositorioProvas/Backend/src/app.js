const express = require("express");
const cors = require("cors");
const provasRoutes = require("./routes/provasRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
    res.json({ ok: true });
});

app.use("/api/provas", provasRoutes);

app.use(errorHandler);

module.exports = app;