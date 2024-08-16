const express = require("express");
const axios = require("axios");
const path = require("path");
const routes = require("./routes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));

app.use((req, res, next) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    next();
});

app.use("/api", async (req, res) => {
    try {
        const response = await axios({
            url: `https://api.themoviedb.org/3${req.url}`,
            method: req.method,
            headers: {
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
                "Content-Type": "application/json",
            },
            params: {
                ...req.query,
                api_key: process.env.TMDB_API_KEY,
            },
            data: req.body,
        });
        res.send(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).send(error.response?.data || "Internal Server Error");
    }
});

app.use("/", routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
