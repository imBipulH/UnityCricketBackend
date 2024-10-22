const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { Schema } = mongoose

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String }
})

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', userSchema)