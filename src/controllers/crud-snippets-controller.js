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
 * Encapsulates a controller.
 */
export class CrudSnippetsController {
  /**
   * Authorizes the user.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   * @returns {Function} Express next middleware function.
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
   * Displays all snippets.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const viewData = {
        crudSnippets: (await CrudSnippet.find({}))
          .map(crudSnippet => ({
            id: crudSnippet._id,
            createdAt: formatDistanceToNow(crudSnippet.createdAt, { addSuffix: true }),
            updatedAt: formatDistanceToNow(crudSnippet.updatedAt, { addSuffix: true }),
            user: crudSnippet.user,
            title: crudSnippet.title,
            language: crudSnippet.language,
            description: crudSnippet.description,
            tags: crudSnippet.tags,
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
          })).reverse()
      }
      res.render('crud-snippets/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Displays all snippets with a certain tag.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   */
  async viewTag (req, res, next) {
    try {
      const viewData = {
        crudSnippets: (await CrudSnippet.find({ tags: req.params.tag }))
          .map(crudSnippet => ({
            id: crudSnippet._id,
            createdAt: formatDistanceToNow(crudSnippet.createdAt, { addSuffix: true }),
            updatedAt: formatDistanceToNow(crudSnippet.updatedAt, { addSuffix: true }),
            user: crudSnippet.user,
            title: crudSnippet.title,
            language: crudSnippet.language,
            description: crudSnippet.description,
            tags: crudSnippet.tags,
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
          })).reverse()
      }
      res.render('crud-snippets/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Displays all snippets created by logged in user.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {Function} next Express next middleware function.
   */
  async mySnippets (req, res, next) {
    try {
      const viewData = {
        crudSnippets: (await CrudSnippet.find({ user: req.session.user.username }))
          .map(crudSnippet => ({
            id: crudSnippet._id,
            createdAt: formatDistanceToNow(crudSnippet.createdAt, { addSuffix: true }),
            user: crudSnippet.user,
            title: crudSnippet.title,
            language: crudSnippet.language,
            description: crudSnippet.description,
            tags: crudSnippet.tags,
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
          })).reverse()
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
   * Returns a HTML form for creating a snippet.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   */
  async create (req, res) {
    res.render('crud-snippets/create')
  }

  /**
   * Creates a new snippet.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   */
  async createPost (req, res) {
    try {
      const crudSnippet = new CrudSnippet({
        user: req.session.user.username,
        title: req.body.title,
        language: req.body.language,
        description: req.body.description,
        tags: req.body.tags.split(',').map(element => element.toLowerCase().trim()),
        snippet: req.body.snippet
      })
      await crudSnippet.save()
      req.session.flash = { type: 'success', text: 'The snippet has been created!' }
      res.redirect('.')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./create')
    }
  }

  /**
   * Returns a HTML form for updated a snippet.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
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
   * Updates a snippet.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   */
  async updatePost (req, res) {
    try {
      const crudSnippet = await CrudSnippet.findById(req.params.id)
      if (crudSnippet) {
        crudSnippet.title = req.body.title
        crudSnippet.language = req.body.language
        crudSnippet.description = req.body.description
        crudSnippet.snippet = req.body.snippet
        crudSnippet.tags = req.body.tags.split(',').map(element => element.toLowerCase().trim())
        await crudSnippet.save()
        req.session.flash = { type: 'success', text: 'The snippet has been updated!' }
      } else {
        req.session.flash = { type: 'danger', text: 'Update failed!' }
      }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./update')
    }
  }

  /**
   * Returns a HTML page for deleting a snippet.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   */
  async delete (req, res) {
    try {
      const crudSnippet = await CrudSnippet.findById(req.params.id)
      const viewData = {
        id: crudSnippet._id,
        createdAt: formatDistanceToNow(crudSnippet.createdAt, { addSuffix: true }),
        updatedAt: formatDistanceToNow(crudSnippet.updatedAt, { addSuffix: true }),
        user: crudSnippet.user,
        title: crudSnippet.title,
        language: crudSnippet.language,
        description: crudSnippet.description,
        tags: crudSnippet.tags,
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
      }
      res.render('crud-snippets/delete', { viewData })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Deletes a snippet.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   */
  async deletePost (req, res) {
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
