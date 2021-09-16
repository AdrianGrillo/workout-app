const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.pre('save', function(next) {
    const user = this

    // If the user hasn't modified their password in any way, don't salt anything.
    if(!user.isModified('password')) {
        return next()
    }

    // Generate salt and assign it to the users password before storing it in mongodb.
    bcrypt.genSalt(10, (err, salt) => {
        if(err) { 
            return next(err)
        } 

        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) {
                return next(err)
            }
            user.password = hash
            next()
        })
    })
})

userSchema.methods.comparePassword = function(candidatePassword) {
    const user = this

    // If this promise resolves, the user gets logged in.
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if(err) {
                return reject(err)
            }

            if(!isMatch) {
                return reject(false)
            }

            resolve(true)
        })
    })
}

mongoose.model('User', userSchema)