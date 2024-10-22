require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const connectDB = require('./config/db')
const Player = require('./models/playerSchema')
const registrationRoute = require('./routes/auth/registration')
const loginRoute = require('./routes/auth/login')
const adminRoute = require('./routes/auth/adminRoute')

const app = express()
connectDB()

const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend URL
  methods: 'GET,POST,DELETE,PUT'
}

app.use(cors(corsOptions))
const PORT = process.env.PORT

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/registration', registrationRoute)
app.use('/login', loginRoute)
app.use('/admin', adminRoute)

// GET route to retrieve all players
app.get('/api/players', async (req, res) => {
  try {
    const players = await Player.find({})
    res.status(200).json(players)
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve players' })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})
