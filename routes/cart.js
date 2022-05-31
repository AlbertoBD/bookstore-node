const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
const { User } = require("../models/users");
const { Product } = require("../models/products");

router.put("/", auth, asyncMiddleware(async (req, res, next) => {
    const user = User.findById(req.user._id);
    const product = Product.findById(req.body._id);

    if (!product) return res.status(404).send("The product with the given ID was not found.");
    if (product.stock < req.body.quantity) return res.status(400).send("Not enough products in stock");

    // if item is not in cart
    if (!user.cart.find(item => item._id === product._id)) {
        product.quantity = 1;
        user.cart.push(product);
    };

    // if item is in cart
    if (user.cart.find(item => item.id === product.id)) {
        const index = user.cart.findIndex(item => item._id === product._id);
        user.cart.splice(index, 1);
        user.cart.push(product);
    };

    await user.save();
    res.send(user);
}));

router.delete("/:id", auth, asyncMiddleware(async (req, res, next) => {
    const user = User.findById(req.user._id);
    const product = Product.findById(req.params.id);

    if (!product) return res.status(404).send("The product with the given ID was not found.");

    const index = user.cart.findIndex(item => item._id === product._id);
    user.cart.splice(index, 1);

    await user.save();
    res.send(user);
}));

module.exports = router;