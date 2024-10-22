const mongoose = require('mongoose')
const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, require: true },
  imageUrl: { type: String }
})

module.exports = mongoose.model('Player', playerSchema)
