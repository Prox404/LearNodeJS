const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const User = require('../app/models/User');


// Signup
router.get('/signup', async (req, res) => {
    const body = req.body;
    if (!(body.email && body.password && body.username)) {
        return res.status(400).send({ error: "Data not formatted properly" });
    }
    const user = new User(body);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    try {
        await user.save();
        res.status(200).send({ user });
    } catch (error) {
        res.status(400).send({ error });
    }
});