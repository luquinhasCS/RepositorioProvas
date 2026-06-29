const express = require("express");
const cors = require("cors");

const provasRoutes = require("./routes/provasRoutes");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
    res.json({
        ok: true
    });
});

app.use("/api/provas", provasRoutes);

module.exports = app;