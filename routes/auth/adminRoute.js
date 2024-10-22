const express = require('express')
const multer = require('multer')
const Player = require('../../models/playerSchema')
const Gallery = require('../../models/gallerySchema')
const Banner = require('../../models/bannerSchema')
const path = require('path')
const fs = require('fs')
const { protect } = require('../../middleware/protect')

const router = express.Router()

// Multer storage configuration for banners and gallery images
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage })

// Route to upload a banner
router.post(
  '/upload-banner',
  protect,
  upload.single('banner'),
  async (req, res) => {
    const currentBanner = await Banner.findOne()

    if (currentBanner) {
      const oldImagePath = path.join('public', currentBanner.imageUrl)
      fs.unlinkSync(oldImagePath, err => {
        if (err) console.log('Failed to delete old banner image:', err)
      })
      await Banner.findByIdAndDelete(currentBanner._id)
    }

    const bannerUrl = `/uploads/${req.file.filename}`
    const newBanner = new Banner({ imageUrl: bannerUrl })
    await newBanner.save()
    res.status(201).json({ message: 'Banner uploaded successfully', bannerUrl })
  }
)

// Route to add a player
router.post('/players', protect, upload.single('image'), async (req, res) => {
  const { name, role } = req.body
  const imageUrl = `/uploads/${req.file.filename}`
  const newPlayer = new Player({ name, role, imageUrl })
  await newPlayer.save()
  res
    .status(201)
    .json({ message: 'Player added successfully', player: newPlayer })
})

// Route to edit a player
router.put(
  '/players/:id',
  protect,
  upload.single('image'),
  async (req, res) => {
    const { id } = req.params
    const { name, role } = req.body
    const updatedData = { name, role }

    if (req.file) {
      updatedData.imageUrl = `/uploads/${req.file.filename}`
    }

    const updatedPlayer = await Player.findByIdAndUpdate(id, updatedData, {
      new: true
    })
    res.status(200).json({ message: 'Player updated', player: updatedPlayer })
  }
)

// Route to delete a player and their image
router.delete('/players/:id', protect, async (req, res) => {
  const { id } = req.params
  const player = await Player.findById(id)

  if (!player) return res.status(404).json({ message: 'Player not found' })
  const imagePath = path.join('public', player.imageUrl)
  fs.unlink(imagePath, async err => {
    if (err) return res.status(500).json({ message: 'Failed to delete image' })
    // Remove player from database
    await Player.findByIdAndDelete(id)
    res.status(200).json({ message: 'Player deleted' })
  })
})

// Route to upload a gallery image
router.post(
  '/gallery',
  protect,
  upload.array('image', 10),
  async (req, res) => {
    try {
      const files = req.files
      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' })
      }
      const galleryImages = []

      for (const file of files) {
        const imageUrl = `/uploads/${file.filename}`
        const newGalleryImage = new Gallery({ imageUrl })
        await newGalleryImage.save()
        galleryImages.push(newGalleryImage)
      }
      res.status(201).json({
        message: 'Images added to gallery',
        images: galleryImages
      })
    } catch (error) {
      res.status(500).json({ message: 'Error uploading files' })
    }
  }
)

// Route to get all gallery images
router.get('/gallery', async (req, res) => {
  const galleryImages = await Gallery.find({})
  res.status(200).json(galleryImages)
})

router.get('/banner', async (req, res) => {
  const banner = await Banner.findOne({})
  res.status(200).json(banner)
})

module.exports = router
