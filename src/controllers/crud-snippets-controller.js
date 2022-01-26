/**
 * Module for the CrudSnippetsController.
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

import { CrudSnippet } from '../models/crud-snippet.js'
/**
 *
 */
export class CrudSnippetsController {
  /**
   * Test.
   *
   * @param {*} req Test.
   * @param {*} res Test.
   * @param {*} next Test.
   */
  async index (req, res, next) {
    try {
      const viewData = {
        crudSnippets: (await CrudSnippet.find({}))
          .map(crudSnippet => ({
            id: crudSnippet._id,
            user: crudSnippet.user,
            snippet: crudSnippet.snippet
          }))
      }
      res.render('crud-snippets/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Test.
   *
   * @param {*} req Test.
   * @param {*} res Test.
   */
  async createForm (req, res) {
    const viewData = {
      user: undefined,
      snippet: undefined
    }
    res.render('code-snippets/create', { viewData })
  }

  /**
   * Test.
   *
   * @param {*} req Test.
   * @param {*} res Test.
   */
  async create (req, res) {
    try {
      const crudSnippet = new CrudSnippet({
        user: req.body.user,
        snippet: req.body.snippet
      })
      await crudSnippet.save()
      req.session.flash = { type: 'success', text: 'The snippet was created successfully' }
      res.redirect('.')
    } catch (error) {
      const viewData = {
        validationErrors: [error.message] || [error.errors.value.message],
        user: req.body.user,
        snippet: req.body.snippet
      }
      res.render('crud-snippets/create', { viewData })
    }
  }
}
