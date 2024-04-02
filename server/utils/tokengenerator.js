const jwt = require('jsonwebtoken');
require('dotenv').config();

const genToken = (id) => {
  return jwt.sign({
    id
  }, 
  'clainbow')
}

module.exports = genToken;