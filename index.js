const express = require('express')
const morgan = require('morgan')

const app = express()
const port = process.env.PORT || 5500
const route = require('./routes/')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw());
app.use(express.text());
app.use(morgan('combined'));

const dotenv = require('dotenv');
const db = require('./config/db');

// get config vars
dotenv.config();

// Connect to DB
db.connect();

// Routes init
route(app);


app.listen(port, () => {
  console.log(`App listening on port ${process.env.PORT || 3000}`)
})