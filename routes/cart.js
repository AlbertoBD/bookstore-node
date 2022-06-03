const express = require("express");
const router = express.Router();
const Transaction = require("mongoose-transactions");
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
const cart = require("../middleware/cart");
const { User } = require("../models/users");
const Order = require("../models/orders");



router.post("/", auth, cart, asyncMiddleware(async (req, res, next) => {
    let products = req.products;
    let totalPrice = req.totalPrice;

    const user = await User.findById(req.user._id);

    const order = new Order({
        user: req.user._id,
        address: user.address,
        products,
        totalPrice
    });

    user.orders.push(order._id);

    await order.save();
    await user.save();

    return res.send("Order placed successfully");
}));

module.exports = router;