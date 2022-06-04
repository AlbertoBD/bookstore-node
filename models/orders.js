const mongoose = require('mongoose');
const { User } = require('../models/users');
const Joi = require("joi");

const ordersSChema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address: {
        type: Object,
        required: true,
    },
    products: [
        {
            _id: mongoose.Schema.Types.ObjectId,
            title: String,
            price: Number,
            quantity: Number,
            image: String,
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    isShipped: {
        type: Boolean,
        default: false,
    },
});

const Order = mongoose.model('Order', ordersSChema);

module.exports = Order