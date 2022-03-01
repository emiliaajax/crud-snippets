/**
 * Module for the UserController.
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

import { User } from '../models/user.js'
import createError from 'http-errors'

/**
 * Encapsulate a controller.
 */
export class UsersController {
  /**
   * Returns a HTML login form.
   *
   * @param {object} req Express request object.
   * @param {object} res Express resonse object.
   */
  async login (req, res) {
    res.render('users/login')
  }

  /**
   * Logs in a user.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   */
  async loginPost (req, res, next) {
    try {
      if (req.body.username.length > 1000 || req.body.password.length > 2000) {
        req.session.flash = { type: 'danger', text: 'Username or password is too long' }
        res.redirect('./login')
      }
      const user = await User.authenticate(req.body.username, req.body.password)
      req.session.regenerate((error) => {
        if (error) {
          throw new Error('Failed to regenerate session.')
        }
        req.session.user = user
        res.redirect('..')
      })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./login')
    }
  }

  /**
   * Logs out current user.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   * @returns {Function} Express next middleware function.
   */
  async logout (req, res, next) {
    if (!req.session.user) {
      return next(createError(404))
    }
    req.session.destroy((error) => {
      if (error) {
        next(error)
      } else {
        res.redirect('..')
      }
    })
  }

  /**
   * Returns a HTML form for registering a user.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   */
  async register (req, res) {
    res.render('users/register')
  }

  /**
   * Registers a new user.
   *
   * @param {object} req Express request object.
   * @param {object} res Express resonse object.
   * @param {Function} next Express next middleware function.
   */
  async registerPost (req, res, next) {
    try {
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      })
      await user.save()
      req.session.flash = { type: 'success', text: 'You have registered successfully!' }
      res.redirect('./login')
    } catch (error) {
      if (error.name === 'ValidationError') {
        req.session.flash = { type: 'danger', text: error.errors[Object.keys(error.errors)[0]].properties.message }
      } else {
        req.session.flash = { type: 'danger', text: error.message }
      }
      res.redirect('./register')
    }
  }
}
