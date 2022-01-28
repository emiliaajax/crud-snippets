/**
 * Mongoose model User.
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [3, 'The username must be at least 3 characters'],
    maxlength: [1000]
  },
  password: {
    type: String,
    minlength: [8, 'The password must be at least 8 characters.'],
    maxlength: [2000],
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  }
}, {
  timestamps: true
})

schema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 8)
})

/**
 * Test.
 *
 * @param {*} username Test.
 * @param {*} password Test.
 * @returns {*} Test.
 */
schema.statics.authenticate = async function (username, password) {
  const user = await this.findOne({ username })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Ivalid username or password.')
  }
  return user
}

export const User = mongoose.model('User', schema)
