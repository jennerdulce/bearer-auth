'use strict';

const users = require('../models/users-model.js');

module.exports = async (req, res, next) => {
  if (!req.headers.auth) {
    next('User invalid');
  }

  let token = req.headers.auth.split(' ').pop();

  users.authenticateToken(token)
    .then(user => {
      req.user = user;
      next()
    })
    .catch(e => res.status(403).json({
      status: 403,
      message: 'Invalid token'
    }))
}