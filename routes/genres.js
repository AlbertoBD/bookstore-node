const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const {Genre}  = require("../models/genres");
const asyncMiddleware = require("../middleware/async");

router.get("/", asyncMiddleware( async (req, res, next) => {
    const genres = await Genre.find().select("-__v");
    res.send(genres);
}));

router.get("/:id", asyncMiddleware( async (req, res, next) => {
    const genre = await Genre.findById(req.params.id).select("-__v");
    if (!genre) return res.status(404).send("The genre with the given ID was not found.");
    res.send(genre);
}));

router.put("/:id", auth, admin, asyncMiddleware( async (req, res, next) => {
    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!genre) return res.status(404).send("The genre with the given ID was not found.");
    res.send(genre);
}));

router.delete("/:id", auth, admin, asyncMiddleware( async (req, res, next) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send("The genre with the given ID was not found.");
    res.send(genre);
}));

router.post("/", auth, admin, asyncMiddleware( async (req, res, next) => {
    const genre = await Genre.save(req.body);
    res.send(genre);
}));

module.exports = router;