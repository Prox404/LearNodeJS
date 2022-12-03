const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');

router.get('/', (req, res) => {
    siteController.indexGET(req, res);
})
router.post('/', (req, res) => {
    siteController.indexPOST(req, res);
})

module.exports = router;