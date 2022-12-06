const verifyToken = require('../app/middlewares/verifyToken');
const express = require('express');
const router = express.Router();

const LinkController = require('../app/controllers/LinkController');

// Store
router.post('/store', async (req, res) => {
    LinkController.store(req, res);
});

// show link 

router.get('/show/:shortLink', async (req, res) => {
    LinkController.show(req, res);
});

// show link has password

router.post('/show/:shortLink', async (req, res) => {
    LinkController.showDetails(req, res);
});

//get All Users link

router.get('/get', verifyToken, async (req, res) => {
    LinkController.getAll(req, res);
});

//search links

router.get('/search', verifyToken, async (req, res) => {
    LinkController.search(req, res);
});

// update link

router.put('/update/:shortLink', verifyToken, async (req, res) => {
    LinkController.update(req, res);
});

// destroy link

router.delete('/destroy/:shortLink', async (req, res) => {
    LinkController.destroy(req, res);
});


module.exports = router;