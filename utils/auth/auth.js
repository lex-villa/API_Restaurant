require('dotenv').config();

const jwt = require('jsonwebtoken');

const validateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // "bearer token" to ["bearer", "token"]

    if (token === null) {
        return res.sendStatus(401).json("Log in, dude");
    };

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        };

        const { is_admin } = user;
        if (is_admin) {
            req.is_admin = is_admin;
            next();
        } else {
            res.status(403).json("You are not Admin");
        };
    });
};

module.exports = { validateJWT };