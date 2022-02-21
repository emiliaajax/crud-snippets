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

router.get('/create', controller.authorize, controller.create)
router.post('/create', controller.authorize, controller.createPost)

router.get('/:id/update', controller.authorize, controller.update)
router.post('/:id/update', controller.authorize, controller.updatePost)

router.get('/:id/delete', controller.authorize, controller.delete)
router.post('/:id/delete', controller.authorize, controller.deletePost)
