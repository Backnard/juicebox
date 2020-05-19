const PORT = 3000;
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const apiRouter = require('./api');
const {client} = require('./db');
const server = express();

server.use(bodyParser.json());

server.use(morgan('dev'));

client.connect();

server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});


server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");
  
  next();
});

server.use('/api', apiRouter);