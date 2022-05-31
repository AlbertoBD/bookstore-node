const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const cartSchema = require('./cart');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 150,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
    },
    address: {
        city: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 100,
        },
        county: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 100,
        },
        street: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 255,
        }
    },
    cart: {
        type: [cartSchema],
        default: [],
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
});

// capitalize first letter of each name from name
userSchema.pre('save', function (next) {
    const words = this.name.split(' ')
    this.name = words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
    next()
  })

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
};

userSchema.methods.calculateCartTotal = function() {
    let total = 0;
    this.cart.forEach(item => {
        total += item.quantity * item.price;
    });
    return total;
};

const User = mongoose.model('User', userSchema);


function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(150).required(),
        confirmPassword: Joi.string().required().valid(Joi.ref('password')),
        address: {
            city: Joi.string().min(3).max(100).required(),
            county: Joi.string().min(3).max(100).required(),
            street: Joi.string().min(3).max(255).required(),
        },
    });
    return schema.validate(user);
};

module.exports = {
    User,
    validateUser,
}