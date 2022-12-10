const multer = require('multer')

const multParse = multer();

class HomeController {

    // [GET] /search

    indexGET(req, res) {
        console.log(req.query)
        return res.send(JSON.stringify("This is ShortURL API"));
    }

    // [POST] /
    indexPOST(req, res) {
        console.log(req.body)
        return res.send(JSON.stringify("This is ShortURL API"));
    }

    // app.post('/', multParse.fields(
    //     [{
    //         name: 'nickname',
    //     },{
    //         name: 'password',
    //     }]
    // ), (req, res) => {

    //     console.log(req.body)
    //     return res.send(req.body ? req.body : 'no query');
    // })
}

module.exports = new HomeController