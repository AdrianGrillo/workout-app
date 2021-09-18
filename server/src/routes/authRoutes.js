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

router.post('/signin', async (req, res) => {
    const { email, password } = req.body

    // Check if email and password were provided by the user.
    if(!email || !password) {
        return res.status(422).send({ error: 'Must provide email and password' })
    }

    // Check if a user with the submitted email exists in our db.
    const user = await User.findOne({ email })
    if(!user) {
        return res.status(422).send({ error: 'Invalid password or email' })
    }

    // If the password submitted matches the email, resolve the promise and sign the user into their account. 
    try {
        await user.comparePassword(password)
        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY')
        res.send({ token })
    } catch {
        return res.status(422).send({ error: 'Invalid password or email' })
    }
})

module.exports = router