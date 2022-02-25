/**
 * The routes.
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'
import { router as homeRouter } from './home-router.js'
import { router as crudSnippetsRouter } from './crud-snippets-router.js'
import { router as usersRouter } from './users-router.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/snippets', crudSnippetsRouter)
router.use('/users', usersRouter)

router.use('*', (req, res, next) => next(createError(404)))
