const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser')

const corsOptions = {
    exposedHeaders: 'Authorization',
    credentials: true,
    origin: [
      "http://localhost:3001",
    ],
  };

module.exports = function(app) {
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors(corsOptions));
};