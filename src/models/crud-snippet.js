/**
 * Mongoose model CrudSnippet.
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  username: {
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
  tags: {
    type: [String],
    validate: [validateLength, 'The number of tags exceed 100']
  },
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
     * Removes sensitive information by transforming the resulting object.
     *
     * @param {object} doc The mongoose document to be converted.
     * @param {object} ret The plain object response which has been converted.
     */
    transform: function (doc, ret) {
      delete ret._id
      delete ret.__v
    }
  }
})

/**
 * Returns true if array length is less than 100, false otherwise.
 * https://stackoverflow.com/questions/28514790/how-to-set-limit-for-array-size-in-mongoose-schema [retrieved 2022-03-03].
 *
 * @param {Array} arr The array to validate.
 * @returns {boolean} True if array length is less than 100, false otherwise.
 */
function validateLength (arr) {
  return arr.length < 100
}

// Creates a virtual property.
schema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Creates a model using the schema.
export const CrudSnippet = mongoose.model('CrudSnippet', schema)
