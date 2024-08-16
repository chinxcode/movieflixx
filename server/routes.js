const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/genres", (req, res) => {
    res.render("genres");
});

router.get("/genre-results", (req, res) => {
    res.render("genre-results");
});

router.get("/discover", (req, res) => {
    res.render("discover");
});

router.get("/my-list", (req, res) => {
    res.render("my-list");
});

router.get("/search-results", (req, res) => {
    res.render("search-results");
});

router.get("/movie/:id", (req, res) => {
    res.render("movie-details");
});

router.get("/tv/:id", (req, res) => {
    res.render("tv-details");
});

router.get("/cast/:id", (req, res) => {
    res.render("person-details");
});

module.exports = router;
