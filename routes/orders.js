const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");
const Order = require("../models/orders");

router.get("/", auth, admin, asyncMiddleware( async (req, res, next) => {
    const orders = await Order.find().select("-__v");
    res.send(orders);
}));


router.get("/me", auth, asyncMiddleware( async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id }).select("-__v, -user");
    res.send(orders);
}));


router.get("/:id", auth, asyncMiddleware( async (req, res, next) => {
    console.log(req.user)
    const order = await Order.findById(req.params.id).select("-__v");

    if (!order) return res.status(404).send("Order not found");

    if (!req.user.isAdmin) {
        if (order.user.toString() !== req.user._id.toString()) return res.status(401).send("Unauthorized");
    }

    await order.populate("user", "name");
  
    res.send(order);
}));


router.put("/:id", auth, admin, asyncMiddleware( async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send("Order not found");

    order.isShipped = true;
    await order.save();

    res.send("succesfully updated");
}));

module.exports = router;