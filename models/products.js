const mongoose = require('mongoose');
const {genresSchema} = require('./genres');
const Joi = require('joi');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    author: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    description: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 3000,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    image: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
    },
    genre: {
        type: String,
        minlenght: 5,
        maxlenght: 50,
        required: true,
    },
});

const Product = mongoose.model('Product', productSchema);

const validateProduct = product => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required(),
        author: Joi.string().min(3).max(50).required(),
        description: Joi.string().min(3).max(3000).required(),
        price: Joi.number().min(0).required(),
        image: Joi.string().required(),
        stock: Joi.number().min(0).required(),
        genre: Joi.string().required(),
    });

    return schema.validate(product);
}

module.exports = {
    Product,
    validateProduct
}