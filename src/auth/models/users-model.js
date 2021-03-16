'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// you need a secret to combind with your username to create a token
// this process adds another layer of security
const SECRET = process.env.APP_SECRET || 'secret';

// putting `new` in front of mongoose is that it allows us to create and use methods on schema instances
const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { toJSON: { virtuals: true } });

// mongoose `pre` hook runs BEFORE whatever mongoose method you put into it and performs the cb funtion. this is similar to a middleware
users.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 10);
})

// to create a token; this function will always run when you create a new user `const user = new User(req.body)
users.virtual('token').get(function () {
  let token = {
    username: this.username
  }
  return jwt.sign(token, SECRET, {expiresIn: '30 days'}); // this is what creates a token for us; combinds the username and secret
});

// checks password with hashed password from the database
// this will be implemented as part of the `basic-auth` middleware which will be put into the `sign in` route
users.statics.authenticateBasic = async function (username, password) {
  // search DB with username to retrieve data
  const user = await this.findOne({ username });
  // compare the decoded password with encrypted password
  const valid = await bcrypt.compare(password, user.password);
  if (valid) { return user; }
  throw new Error('THIS IS WHAT TRIGGERS ERROR FOR CATCH STATEMENT');
}

// verifies token will be implemented as part of the `bearer-auth` middleware which will be put into a route where a token will be needed to access it
users.statics.authenticateToken = async function (token) {
  const parsed = await jwt.verify(token, SECRET);
  const user = await this.findOne({ username: parsed.username })
  if (user) { return user; }
  throw new Error('INVALID TOKEN')
}

module.exports = mongoose.model('users', users)