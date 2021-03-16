'use strict';

const express = require('express');
const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');
const User = require('./models/users-model.js');

const authRoutes = express.Router();

authRoutes.post('/signup', signUpHandler)
authRoutes.post('/signin', basicAuth, signInHandler)
authRoutes.get('/admin', bearerAuth, adminHandler)



function signUpHandler(req, res) {
  // using the signUp route will create users
  // username and password will be passed through req.body
  const user = new User(req.body);
  // hashes the passed in password 10 times and reassigns the password
  // then saves to the object to the DB
  console.log(user)
  user.save()
    .then(user => {
      res.status(201).json(user)
    })
}

function signInHandler(req, res) {
  // users will pass in information through headers which will be processed through the basic auth middleware
  res.status(200).json({ 
    message: 'User successfully signed in', 
    user: req.user })
}

function adminHandler(req, res) {
  res.status(200).json({ 
    message: 'User is authorized to use `Admin` route', 
    user: req.user });
}


module.exports = authRoutes;