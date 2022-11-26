const express = require('express')
const morgan = require('morgan')
const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded());
app.use(morgan('combined'));

app.get('/', (req, res) => {
  console.log(req.query)
  return res.send(req.query.q ? req.query.q : 'no query');
})

app.post('/', (req, res) => {
    console.log(res)
    return res.send(req.body ? req.body : 'no query');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})