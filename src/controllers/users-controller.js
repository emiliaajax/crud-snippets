/**
 * Module for the UserController.
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

import { User } from '../models/user.js'

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
        res.redirect('.')
      })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./login')
    }
  }
}
