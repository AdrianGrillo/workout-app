require('./models/User')
const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes')
const requireAuth = require('./middlewares/requireAuth')

const app = express()

app.use(express.json())
app.use(authRoutes)

const mongoUri = 'mongodb+srv://Admin:passwordpassword@track-server.x49zw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(mongoUri)

mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance')
})

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to mongo', err)
})

app.get('/', requireAuth, (req, res) => {
    res.send(`Your email: ${req.user.email}`)
})

app.listen(3002, () => {
    console.log('Listening on port 3002')
}) 