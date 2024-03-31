const jwt = require('jsonwebtoken');
require('dotenv').config();

const genToken = (id) => {
  return jwt.sign({
    id
  }, 
  process.env.SECRET)
}

module.exports = genToken;