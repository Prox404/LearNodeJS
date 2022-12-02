const verifyToken = require('../app/middlewares/verifyToken');
const express = require('express');
const router = express.Router();

const LinkController = require('../app/controllers/LinkController');

// Signup
router.post('/store', async (req, res) => {
    LinkController.store(req, res);
});


module.exports = router;