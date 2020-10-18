require('dotenv').config();

const jwt = require('jsonwebtoken');
// Queries
const { findUserByEmail, findUserByUsername, insertQuery, usersList } = require("../../database/queries/queries");
// Database
const { sequelize } = require("../../database/sequelize/config");


const getUsers = async (req, res, next) => {
    try {
        req.usersList = await usersList();
        next();
    } catch (error) {
        next(new Error(error));
    };
};

const validateExistingUser = async (req, res, next) => {
    const { username, email } = req.body;
    try {
        const isFoundEmail = await findUserByEmail(email);
        if (!isFoundEmail) {
            const dbExistingUser = await findUserByUsername(username);
            if (!dbExistingUser) {
                next();
            } else {
                res.status(409).json("Username already in use");
            }
        } else {
            res.status(409).json("Email already exists");
        }
    } catch (error) {
        next(new Error(error));
    }
};

const registerUser = async (req, res, next) => {
    const { username, password, firstname, lastname, address, email, phone_number, is_admin } = req.body;

    if (username && password && firstname && lastname && address && email && phone_number) {
        try {
            const query = insertQuery(
                "users",
                "username, password, firstname, lastname, address, email, phone_number, is_admin",
                [username, password, firstname, lastname, address, email, phone_number, is_admin]
            );

            [userId] = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

            req.createdUserId = userId;
            next();

        } catch (error) {
            next(new Error(error));
        };
    };
};

const validateCredentials = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const userExistingInDB = await findUserByUsername(username);

        if (userExistingInDB) {
            const { password: dbPassword, is_admin } = userExistingInDB;

            if (dbPassword === password) {
                const token = jwt.sign({ username, is_admin }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "20m"});

                req.jwtToken = token;

                next();

            } else {
                res.status(400).json("Wrong password")
            };

        } else {
            res.status(400).json("Cannot find user")
        };

    } catch (error) {
        next(new Error(error));
    };
};

module.exports = { getUsers, validateExistingUser, registerUser, validateCredentials };