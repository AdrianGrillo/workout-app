const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = mongoose.model('User')
 
const router = express.Router()

router.post('/signup', async (req, res) => {
    const { email, password } = req.body

    try {
        // Save new user to db
        const user = new User({ email, password })
        await user.save()

        // sign jwt and send along userId as the payload to be checked by middleware
        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY')
        res.send({ token })
    } catch(err) {
        return res.status(422).send(err.message)
    }
})

module.exports = router