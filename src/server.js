/**
 * The starting point of the application.
 *
 * @author Emilia Hansson <eh222yn@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import session from 'express-session'
import logger from 'morgan'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { router } from './routes/router.js'
import { connectDB } from './config/mongoose.js'
import helmet from 'helmet'

try {
  // Connects to MongoDB.
  await connectDB()

  // Creates an Express application.
  const app = express()

  // Gets the directory name of this module path.
  const directoryFullName = dirname(fileURLToPath(import.meta.url))

  // Sets the base URL to use for all relative URLs in a document.
  const baseURL = process.env.BASE_URL || '/'

  // Sets HTTP headers to make application more secure.
  app.use(helmet())
  app.use(helmet({ crossOriginEmbedderPolicy: true }))
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
        'style-src-elem': ["'self'", "'unsafe-inline'", 'fonts.googleapis.com', 'cdn.jsdelivr.net'],
        'font-src': ["'self'", 'fonts.gstatic.com']
      }
    })
  )

  // Sets up a morgan logger using the dev format for log entries.
  app.use(logger('dev'))

  // Sets up view engine.
  app.set('view engine', 'ejs')
  app.set('views', join(directoryFullName, 'views'))
  app.use(expressLayouts)
  app.set('layout', join(directoryFullName, 'views', 'layouts', 'default'))

  // Parses requests of the content type application/x-www-form-urlencoded.
  // Populates the request object with a body object (req.body)
  app.use(express.urlencoded({ extended: false }))

  // Serves static files.
  app.use(express.static(join(directoryFullName, '..', 'public')))

  // Sets up and uses session middleware.
  const sessionOptions = {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'strict'
    }
  }

  // Trusts first proxy and sets cookie secure to true when in production.
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1)
    sessionOptions.cookie.secure = true
  }

  app.use(session(sessionOptions))

  // Middleware to be executed before the routes.
  app.use((req, res, next) => {
    // Passes the base URL to the views.
    res.locals.baseURL = baseURL

    // Passes the flash messages to the views.
    if (req.session.flash) {
      res.locals.flash = req.session.flash
      delete req.session.flash
    }

    // Passes the user to the views if user is logged in.
    if (req.session.user) {
      res.locals.username = req.session.user.username
    }
    next()
  })

  // Registers routes.
  app.use('/', router)

  // Handles error.
  app.use(function (err, req, res, next) {
    // 403 Forbidden
    if (err.status === 403) {
      return res
        .status(403)
        .sendFile(join(directoryFullName, 'views', 'errors', '403.html'))
    }
    // 404 Not Found
    if (err.status === 404) {
      return res
        .status(404)
        .sendFile(join(directoryFullName, 'views', 'errors', '404.html'))
    }
    // 500 Internal Server Error
    if (req.app.get('env') !== 'development') {
      return res
        .status(500)
        .sendFile(join(directoryFullName, 'views', 'errors', '500.html'))
    }

    // Renders the error page.
    res.status(err.status || 500).render('errors/error', { error: err })
  })

  // Starts the HTTP server listening for connections.
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
