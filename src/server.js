'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const notFoundHandler = require('./middleware/404.js')
const errorHandler = require('./middleware/500.js')
const authRoutes = require('./auth/router.js')

const app = express();

// .urlencoded() parses incoming request with urlencoded payloads based on body parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(authRoutes);
app.use('*', notFoundHandler)
app.use(errorHandler)

module.exports = {
  app: app,
  start: port => {
    app.listen(port, () => {
      console.log(`Now listening on port: ${port}`)
    })
  }
}