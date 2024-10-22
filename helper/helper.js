require('dotenv').config()
const jwt = require('jsonwebtoken')

const generateToken = user => {
  return jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d'
    }
  )
}

module.exports = generateToken
