const bcrypt = require('bcrypt');

const Link = require('../models/Link/Link');
const User = require('../models/User/User');
const jwt = require('jsonwebtoken');

class LinkController {

    // check isset short link

    async checkShortLink(shortLink) {
        console.log("call checkShortLink");
        try {
            if (shortLink == '' || shortLink == null) {
                return false;
            } else {
                const isset = await Link.findOne({ short_link: shortLink });
                if (isset) {
                    console.log('isset');
                    return true;
                }
                console.log('not isset');
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    }


    // create random string 8 characters

    async randomString() {
        console.log("call randomString");
        const length = 8;
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        let isset = true;

        while (isset) {
            for (let i = length; i > 0; --i) {
                result += chars[Math.floor(Math.random() * chars.length)];
            }
            isset = await this.checkShortLink(result).then((isset) => {
                if (isset) {
                    return true;
                }
                return false;
            });
        }
        console.log("result: " + result);
        return result;
    }

    // [POST] /login

    async store(req, res) {
        console.log("call store");
        const body = req.body;
        if (!(body.link && req.header("authorization"))) {
            return res.status(400).send({ error: "Data not formatted properly" });
        }
        try {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            const user = await User.findOne({ _id: verified._id });
            if (!user) {
                return res.status(400).send({ error: "User not found" });
            }

            const isset = await this.checkShortLink(body.short_link).then((isset) => {
                if (isset) {
                    return true;
                }
                return false;
            });

            if (body.short_link == '' || body.short_link == null) {
                body.short_link = await this.randomString();
            }
            if (isset) {
                return res.status(400).send({ error: "Short link already exists" });
            } else {
                console.log("call insert");
                console.log(body.short_link);
                const link = new Link();
                link.link = body.link;
                link.user_id = user._id;
                link.short_link = body.short_link;
                link.password = body.password ? body.password : '';
                console.log(link);
                await link.save();
                res.status(200).send({ link });
            }
        } catch (error) {
            console.error(error);
            res.status(400).send({ error });
        }
    }
}

module.exports = new LinkController;