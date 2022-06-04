const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const users = require("../routes/users")
const auth = require("../routes/auth");
const products = require("../routes/products");
const genres = require("../routes/genres");
const cart = require("../routes/cart");
const orders = require("../routes/orders");

const corsOptions = {
    exposedHeaders: 'Authorization',
    credentials: true,
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      "http://192.168.100.16:3001",
    ],
  };

module.exports = function(app) {
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors(corsOptions));
    app.use("/api/users", users);
    app.use("/api/auth", auth);
    app.use("/api/products", products);
    app.use("/api/genres", genres);
    app.use("/api/cart", cart);
    app.use("/api/orders", orders);
};