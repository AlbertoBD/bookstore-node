const mongoose = require('mongoose');
const Joi = require("joi");

const genresSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    }
});

const Genre = mongoose.model('Genre', genresSchema);

// capitalize first letter before save
genresSchema.pre('save', function (next) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
    next();
})

module.exports = {
    Genre,
    genresSchema
}