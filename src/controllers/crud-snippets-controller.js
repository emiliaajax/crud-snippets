/**
 * Module for the CrudSnippetsController.
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

import createError from 'http-errors'
import { formatDistanceToNow } from 'date-fns'
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
   * @returns {*} Next middleware.
   */
  async authorize (req, res, next) {
    if (!req.session.user) {
      return next(createError(404))
    } else if (req.params.id) {
      const crudSnippet = await CrudSnippet.findById(req.params.id)
      if (req.session.user.username !== crudSnippet.user) {
        return next(createError(403))
      }
    }
    next()
  }

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
            createdAt: formatDistanceToNow(crudSnippet.createdAt, { addSuffix: true }),
            user: crudSnippet.user,
            snippet: crudSnippet.snippet,
            /**
             * Returns true if the user is the creator, false otherwise.
             *
             * @returns {boolean} True if the user is the creator, false otherwise.
             */
            creator: function () {
              if (req.session.user) {
                return req.session.user.username === crudSnippet.user
              } else {
                return false
              }
            }
          }))
      }
      res.render('crud-snippets/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  // isCreator (req, snippet) {
  //   if (req.session.user) {
  //     return req.session.user.username === snippet
  //   }
  //   return false
  // }

  /**
   * Test.
   *
   * @param {*} req Test.
   * @param {*} res Test.
   */
  async createForm (req, res) {
    res.render('crud-snippets/create')
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
        user: req.session.user.username,
        snippet: req.body.snippet
      })
      await crudSnippet.save()
      req.session.flash = { type: 'success', text: 'The snippet was created successfully' }
      res.redirect('.')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./create')
    }
  }

  /**
   * Test.
   *
   * @param {*} req Test.
   * @param {*} res Test.
   */
  async update (req, res) {
    try {
      const crudSnippet = await CrudSnippet.findById(req.params.id)
      res.render('crud-snippets/update', { viewData: crudSnippet.toObject() })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Test.
   *
   * @param {*} req Test.
   * @param {*} res Test.
   */
  async updateSnippet (req, res) {
    try {
      const crudSnippet = await CrudSnippet.findById(req.params.id)
      if (crudSnippet) {
        crudSnippet.snippet = req.body.snippet
        await crudSnippet.save()
        req.session.flash = { type: 'success', text: 'The snippet was updated successfully' }
      } else {
        req.session.flash = {
          type: 'danger',
          text: 'Update failed!'
        }
      }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./update')
    }
  }

  /**
   * Test.
   *
   * @param {*} req Test.
   * @param {*} res Test.
   */
  async delete (req, res) {
    try {
      const crudSnippet = await CrudSnippet.findById(req.params.id)
      res.render('crud-snippets/delete', { viewData: crudSnippet.toObject() })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Test.
   *
   * @param {*} req Test.
   * @param {*} res Test.
   */
  async deleteSnippet (req, res) {
    try {
      await CrudSnippet.findByIdAndDelete(req.params.id)
      req.session.flash = { type: 'success', text: 'The snippet has been deleted!' }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./delete')
    }
  }
}
