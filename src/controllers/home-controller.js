/**
 * Module for the HomeController.
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Encapsulates a controller.
 */
export class HomeController {
  /**
   * Renders a view and sends the rendered HTML string as an HTTP response.
   *
   * @param {object} req Express request object.
   * @param {object} res Express response object.
   * @param {object} next Express next middleware function.
   */
  async index (req, res, next) {
    res.render('home/index')
  }
}
