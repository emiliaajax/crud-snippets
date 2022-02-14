/**
 * Module for the UserController.
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

import { User } from '../models/user.js'
import createError from 'http-errors'

/**
 *
 */
export class UsersController {
  /**
   * Test.
   *
   * @param {*} req Test.
   * @param {*} res Test.
   */
  async login (req, res) {
    res.render('users/login')
  }

  /**
   * Test.
   *
   * @param {*} req Test.
   * @param {*} res Test.
   * @param {*} next Test.
   */
  async loginPost (req, res, next) {
    try {
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
   * Test.
   *
   * @param {*} req Test.
   * @param {*} res Test.
   * @param {*} next Test.
   * @returns {*} test.
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
   * Test.
   *
   * @param {*} req Test.
   * @param {*} res Test.
   */
  async register (req, res) {
    res.render('users/register')
  }

  /**
   * Test.
   *
   * @param {*} req Test.
   * @param {*} res Test.
   * @param {*} next Test.
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
      if (Object.keys(error.keyValue)[0] === 'username') {
        req.session.flash = { type: 'danger', text: 'The username is already taken!' }
      } else if (Object.keys(error.keyValue)[0] === 'email') {
        req.session.flash = { type: 'danger', text: 'The email is already in use!' }
      } else {
        req.session.flash = { type: 'danger', text: 'error.message' }
      }
      res.redirect('./register')
    }
  }
}
