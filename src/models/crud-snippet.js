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
  title: {
    type: String,
    required: true,
    maxlength: [100, 'The title can\'t exceed 100 characters.']
  },
  language: {
    type: String,
    required: true,
    maxlength: [50, 'The language name can\'t exceed 50 characters.']
  },
  description: {
    type: String,
    required: true,
    maxlength: [8000, 'The description can\'t exceed 8000 characters']
  },
  tags: [String],
  snippet: {
    type: String,
    required: true,
    maxlength: [8000, 'The snippet can\'t exceed 8000 characters.']
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
