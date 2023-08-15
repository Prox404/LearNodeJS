const bcrypt = require('bcrypt');

const User = require('../models/User/User');
const Link = require('../models/Link/Link');
const UserToken = require('../models/UserToken/UserToken');
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
                return res.status(401).send({ error: "User not found" });
            }
            const validPassword = await bcrypt.compare(body.password, user.password);
            if (!validPassword) {
                return res.status(401).send({ error: "Password is not correct" });
            }
            const accessToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });
            const refreshToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 * 24 * 365 });
            await new UserToken({ userId: user._id, token: refreshToken }).save();
            const { password, role, ...data } = user._doc;
            res.status(200).send({ data, accessToken, refreshToken });
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
            const { password, role, __v, ...data } = user._doc;
            res.status(200).send({ data });
        } catch (error) {
            res.status(400).send({ error });
        }
    }

    // [POST] /refresh-token
    async refreshToken(req, res) {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            return res.status(401).send({ error: "You are not authenticated" });
        }
        try {
            const user = jwt.verify(refreshToken, process.env.TOKEN_SECRET);
            const accessToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });
            res.status(200).send({ accessToken });
        } catch (error) {
            console.error(error);
            res.status(400).send({ error });
        }
    }

    // [POST] /logout
    async logout(req, res) {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            return res.status(401).send({ error: "You are not authenticated" });
        }
        try {
            const user = jwt.verify(refreshToken, process.env.TOKEN_SECRET);
            const accessToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });
            await UserToken.deleteOne({ userId: user._id, token: refreshToken });
            res.status(200).send({ accessToken });
        } catch (error) {
            console.error(error);
            res.status(400).send({ error });
        }
    }

    async profile(req, res) {
        const authorization = req.headers['authorization'];
        const token = authorization && authorization.split(' ')[1];
        try {

            let user = jwt.verify(token, process.env.TOKEN_SECRET);
            user = await User.findOne({ _id: user._id }).then(user => {
                let links = Link.find({ user_id: user._id }).then(link => {
                    console.log(link);
                    const { password, role, __v, ...data } = user._doc;
                    data.link = link;
                    res.status(200).send({ data });
                });
            });
        } catch (e) {
            console.error(e);
            res.status(400).send({ error: e });
        }

    }

    async update(req, res) {
        console.log("update call");
        console.log(req.body);
        const authorization = req.headers['authorization'];
        const token = authorization && authorization.split(' ')[1];
        try {
            let user = jwt.verify(token, process.env.TOKEN_SECRET);
            if (!user) {
                return res.status(400).send({ error: "User not found" });
            } else {
                user.username = req.body.username ? req.body.username : user.username;
                user.email = req.body.email ? req.body.email : user.email;
                user.avatar = req.body.avatar ? req.body.avatar : user.avatar;

                user.save();

                const { password, role, __v, ...data } = user._doc;
                res.status(200).send({ data });
            }
        } catch (e) {
            console.error(e);
            res.status(400).send({ error: e });
        }
    }

    async facebookAuth(req, res) {
        const body = req.body;
        if (!(body.email && body.id && body.name)) {
            return res.status(400).send({ error: "Data not formatted properly" });
        }
        try {
            const { email, id, name, picture } = body;
            const newUser = await User.findOne({ email: email});

            if (newUser) {
                console.log("User already exists");
                console.log(newUser);
                const accessToken = jwt.sign({ _id: newUser._id }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });
                const refreshToken = jwt.sign({ _id: newUser._id }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 * 24 * 365 });
                const {password, role, ...data} = newUser._doc;
                res.status(200).send({ data, accessToken, refreshToken });
            }else{
                console.log("Create new user");
                const user = new User({
                    email : email,
                    password : id,
                    username : name,
                    avatar : picture,
                });
    
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
                await user.save();
                const accessToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });
                const refreshToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 * 24 * 365 });
                const {password, role, ...data} = user._doc;
                res.status(200).send({ data, accessToken, refreshToken });
            }
        } catch (error) {
            res.status(400).send({ error });
        }
    }

}

module.exports = new UserController;