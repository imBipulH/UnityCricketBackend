const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  caption: { type: String },
  uploadedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Banner', bannerSchema)
