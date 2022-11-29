const express = require('express')
const morgan = require('morgan')

const app = express()
const port = 3000
const route = require('./routes/')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw());
app.use(express.text());
app.use(morgan('combined'));

const db = require('./config/db');

// Connect to DB
db.connect();

route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})