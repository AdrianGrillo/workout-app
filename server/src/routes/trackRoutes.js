const express = require('express')
const mongoose = require('mongoose')
const requireAuth = require('../middlewares/requireAuth')

const Track = mongoose.model('Track')

const router = express.Router()

// User must be signed in to make requests to track routes.
router.use(requireAuth)

// Find all tracks that have the same id as the user who is signed in and send them back. 
router.get('/tracks', async (req, res) => {
    const tracks = await Track.find({ userId: req.user._id })

    res.send(tracks)
})

module.exports = router