/**
 * Crud snippets routes.
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import { CrudSnippetsController } from '../controllers/crud-snippets-controller.js'

export const router = express.Router()
const controller = new CrudSnippetsController()

router.get('/', controller.index)

router.get('/create', controller.createForm)
router.post('/create', controller.create)
