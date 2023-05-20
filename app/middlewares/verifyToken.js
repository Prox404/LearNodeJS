const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).send({ Error: "Access Denied" });
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).send({ Error: "Access Denied" });
    try {
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err){
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).send({ Error: "Token Expired" });
                }
                return res.status(403).send({ Error: "Invalid Token" });
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        res.status(400).send("Invalid Token");
    }
}

module.exports = verifyToken;