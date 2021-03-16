'use strict';

module.exports = (err, req, res, next) => {
  // basic auth: invalid user
  if (err === 'Login does not exist..') {
    res.status(403).json({
      error: err,
      status: 403,
    })

  } else if (err === 'Invalid token') {
    res.status(403).json({
      error: err,
      status: 403,
    })

  } else {
    res.status(500).json({
      error: err || err.message,
      status: 500,
      message: 'Something went wrong..'
    })
  }

}