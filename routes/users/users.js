const express = require("express");
const router = express.Router();
//Middleware
const { getUsers, validateExistingUser, registerUser, validateCredentials } = require("./middlewareUsers");
const { validateJWT } = require("../../utils/auth/auth");

// Routes
router.get("/", validateJWT, getUsers, (req, res) => {
    const { usersList } = req;
    res.status(200).json(usersList);
});

router.post("/", validateExistingUser, registerUser, (req, res) => {
    const { createdUserId } = req;
    res.status(201).json({ userId: createdUserId });
});

router.post("/login", validateCredentials, (req, res) => {
    const { jwtToken } = req;
    const loginResponse = { token: jwtToken };
    res.status(200).json(loginResponse);
});

module.exports = router;