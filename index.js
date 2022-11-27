const express = require('express')
const morgan = require('morgan')
const multer = require('multer')

const app = express()
const port = 3000
const route = require('./routes/')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw());
app.use(express.text());
app.use(morgan('combined'));

const multParse = multer();

route(app);

// app.get('/', (req, res) => {
//   console.log(req.query)
//   return res.send(req.query.q ? req.query.q : 'no query');
// })

// form-data

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

// x-www-form-urlencoded
// text/plain
// application/json
// app.post('/', (req, res) => {
//     console.log(req.body)
//     return res.send(req.body ? req.body : 'no query');
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})