const express = require('express')
const { check, validationResult } = require('express-validator')
const User = require('../../models/userSchema')
const generateToken = require('../../helper/helper')
const router = express.Router()

router.post(
  '/',
  [
    check('email', 'Please enter a valid email address').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      const user = await User.findOne({ email })
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] })
      }

      const isMatch = await user.comparePassword(password)

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] })
      }

      const token = generateToken(user)

      res.json({ token })
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error', err)
    }
  }
)

module.exports = router
