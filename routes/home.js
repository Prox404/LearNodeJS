const express = require('express');
const router = express.Router();

const homeController = require('../app/controllers/HomeController');

router.get('/', (req, res) => {
    homeController.indexGET(req, res);
})
router.post('/', (req, res) => {
    homeController.indexPOST(req, res);
})

module.exports = router;