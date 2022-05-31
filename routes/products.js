const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Product, validateProduct } = require("../models/products");
const {Genre} = require("../models/genres");
const asyncMiddleware = require("../middleware/async");

router.get("/", asyncMiddleware( async (req, res, next) => {
    const products = await Product.find().select("-__v");
    res.send(products);
}));

router.get("/:id", asyncMiddleware( async (req, res, next) => {
    const product = await Product.findById(req.params.id).select("-__v");
    if (!product) return res.status(404).send("The product with the given ID was not found.");
    res.send(product);
}));

router.put("/:id", auth, admin, asyncMiddleware( async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).send("The product with the given ID was not found.");
    res.send(product);
}));



router.delete("/:id", auth, admin, asyncMiddleware( async (req, res, next) => {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product) return res.status(404).send("The product with the given ID was not found.");
    res.send(product);
}));


router.post("/", auth, admin, asyncMiddleware( async (req, res, next) => {
    capitalizeGenre = req.body.genre.charAt(0).toUpperCase() + req.body.genre.slice(1).toLowerCase();
    req.body.genre = capitalizeGenre;

    const genre = await Genre.findOne({ name: capitalizeGenre });
    if (!genre) {
        const newGenre = new Genre({ name: req.body.genre });
        await newGenre.save()
        req.body.genre = newGenre.name;
    };
    
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).send(error.details[0].message)
    
    const product = new Product({ 
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        genre: req.body.genre,
        price: req.body.price,
        stock: req.body.stock,
        image: req.body.image
    });
    await product.save();
    res.send(product);
}));

module.exports = router;