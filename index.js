require('dotenv').config();
const { PORT = 3000 } = process.env;
const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const { client } = require('./db');
client.connect();

const apiRouter = require('./api');

server.use(bodyParser.json());
server.use(morgan('dev'));

// `/api` routes
server.use('/api', apiRouter);

server.get('/background/:color', (req, res, next) => {
  res.send(`
    <body style="background: ${ req.params.color };">
      <h1>Hello World</h1>
    </body>
  `);
});

server.get('/add/:first/to/:second', (req, res, next) => {
  res.send(`<h1>${ req.params.first } + ${ req.params.second } = ${
    Number(req.params.first) + Number(req.params.second)
   }</h1>`);
});

server.use((req, res, next) => {
  console.log('<___Body Logger START___>');
  console.log(req.body);
  console.log('<___Body Logger END___>');
  next();
});

server.listen(PORT, () => {
  console.log('Server listening! Juice is flowing on PORT', PORT);
});
