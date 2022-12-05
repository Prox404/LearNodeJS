const bcrypt = require('bcrypt');

const User = require('../models/User/User');
const jwt = require('jsonwebtoken');

class UserController {

    // [POST] /login

    async login(req, res) {
        const body = req.body;
        if (!(body.email && body.password)) {
            return res.status(400).send({ error: "Data not formatted properly" });
        }
        try {
            const user = await User.findOne({ email: body.email });
            if (!user) {
                return res.status(400).send({ error: "User not found" });
            }
            const validPassword = await bcrypt.compare(body.password, user.password);
            if (!validPassword) {
                return res.status(400).send({ error: "Password is not correct" });
            }
            const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 * 24 }); 
            const {password, role, ...data} = user._doc;
            res.status(200).send({ data, token });
        } catch (error) {
            console.error(error);
            res.status(400).send({ error });
        }
    }

    // [POST] /signup

    async signup(req, res) {
        const body = req.body;
        if (!(body.email && body.password && body.username)) {
            return res.status(400).send({ error: "Data not formatted properly" });
        }
        const user = new User(body);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        try {
            await user.save();
            const {password, role, __v, ...data} = user._doc;
            res.status(200).send({ data });
        } catch (error) {
            res.status(400).send({ error });
        }
    }
}

module.exports = new UserController;