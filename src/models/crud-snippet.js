/**
 * The starting point of the application.
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
  timestamps: true
})

export const CrudSnippet = mongoose.model('CrudSnippet', schema)
