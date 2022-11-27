class HomeController {

    // [GET] /search

    indexGET(req, res) {
        console.log(req.query)
        return res.send(req.query.q ? req.query.q : 'no query');
    }
    
    // [POST] /
    indexPOST(req, res) {
        console.log(req.body)
        return res.send(req.body ? req.body : 'no query');
    }
}

module.exports = new HomeController