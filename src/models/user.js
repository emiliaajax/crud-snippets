/**
 * Mongoose model User.
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import validator from 'validator'

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [3, 'The username must be at least 3 characters.'],
    maxlength: [1000, 'The username must be less than 1000 characters.'],
    validate: [validator.isAlphanumeric, 'Username must only contain letters (A-Z) and numbers (0-9).']
  },
  password: {
    type: String,
    minlength: [8, 'The password must be at least 8 characters.'],
    maxlength: [2000, 'The password must be less than 2000 characters.'],
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    // Validate property is inspired by https://stackoverflow.com/questions/18022365/mongoose-validate-email-syntax. Retrieved (2022-02-21).
    validate: [validator.isEmail, 'Invalid e-mail!']
  }
}, {
  timestamps: true
})

// Before saving the password is salted and hashed.
schema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 8)
})

// Inspired from https://mongoosejs.com/docs/middleware.html#post (retrieved at 2022-02-20)
schema.post('save', function (error, doc, next) {
  if (error.name === 'MongoServerError' & error.code === 11000) {
    if (Object.keys(error.keyValue)[0] === 'username') {
      throw new Error('The username is already taken!')
    } else if (Object.keys(error.keyValue)[0] === 'email') {
      throw new Error('The email is already in use!')
    }
  } else {
    next()
  }
})

/**
 * Authenticates a user.
 *
 * @param {string} username The username.
 * @param {string} password The password.
 * @returns {Promise} Resolves to a user object.
 */
schema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid username or password.')
  }
  return user
}

// Creates a model using the schema.
export const User = mongoose.model('User', schema)
