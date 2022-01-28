/**
 * Users routes.
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import { UsersController } from '../controllers/users-controller.js'

export const router = express.Router()
const controller = new UsersController()

router.get('/login', controller.login)
router.post('/login', controller.loginPost)

router.get('/register', controller.register)
router.post('/register', controller.registerPost)
