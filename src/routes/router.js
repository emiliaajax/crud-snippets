/**
 * The routes.
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { router as crudSnippetsRouter } from './crud-snippets-router.js'

export const router = express.Router()

router.use('/', crudSnippetsRouter)
router.use('*', (req, res, next) => next(createError(404)))
