'use strict';

const base64 = require('base-64');
const users = require('../models/users-model.js');

module.exports = async (req, res, next) => {
  // username and pw not passed through headers
  // console.log('req.headers', req.headers)
  if (!req.headers.auth) {
    next('Sorry, you are not authorized');
  }

  // upon signin, user info is encoded and passed from client to server
  // user and pass is then sent to be authenticated..
  let basic = req.headers.auth.split(' '). pop();
  let [user, pass] = base64.decode(basic).split(':');

  // users.authenticateBasic(user, pass)
  //   .then(user => {
  //     req.user = user;
  //     // console.log(`THIS IS REQ.USER${req.user}`)
  //     next()
  //   })
  //   .catch( e => next('Login does not exist..')) // THIS IS WHERE IT CATCHES AND PASSES TO ERROR HANDLER


  try {
    req.user = await users.authenticateBasic(user, pass);
    next();
  } catch (e) {
    res.status(403).json({
      status: 403,
      message: 'Login does not exist'
    })
  }
}