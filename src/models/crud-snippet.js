/**
 * Mongoose model CrudSnippet.
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  snippet: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  toObject: {
    virtuals: true,
    /**
     * Test.
     *
     * @param {*} doc Test.
     * @param {*} ret Test.
     */
    transform: function (doc, ret) {
      delete ret._id
      delete ret.__v
    }
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

export const CrudSnippet = mongoose.model('CrudSnippet', schema)
