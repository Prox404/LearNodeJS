const verifyToken = require('../app/middlewares/verifyToken');
const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController');

// Signup
router.post('/signup', async (req, res) => {
    userController.signup(req, res);
});

// Login
router.post('/login', async (req, res) => {
    userController.login(req, res);
});

router.get('/profile', verifyToken, async (req, res) => {
    userController.profile(req, res);
});

module.exports = router;