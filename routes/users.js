const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const { User, validateUser } = require("../models/users");
const asyncMiddleware = require("../middleware/async");

router.get("/me", auth, asyncMiddleware( async (req, res, next) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
}));


router.post("/", asyncMiddleware(async (req, res, next) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const alreadyRegistered = await User.findOne({ email: req.body.email });
    if (alreadyRegistered) return res.status(400).send("User already registered");

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPass,
        address: req.body.address
    });

    await user.save();

    const token = user.generateAuthToken();

    res.cookie("Authorization", token, {
        httpOnly: true,
        secure: true,
    }).send("Te-ai inregistrat cu succes");

}));

module.exports = router;