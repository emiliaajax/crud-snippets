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

try {
  await connectDB()
  const app = express()
  const directoryFullName = dirname(fileURLToPath(import.meta.url))
  const baseURL = process.env.BASE_URL || '/'
  app.use(logger('dev'))
  app.set('view engine', 'ejs')
  app.set('views', join(directoryFullName, 'views'))
  app.use(expressLayouts)
  app.set('layout', join(directoryFullName, 'views', 'layouts', 'default'))
  app.use(express.urlencoded({ extended: false }))
  app.use(express.static(join(directoryFullName, '..', 'public')))
  const sessionOptions = {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'lax'
    }
  }
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1)
    sessionOptions.cookie.secure = true
  }
  app.use(session(sessionOptions))
  app.use((req, res, next) => {
    res.locals.baseURL = baseURL
    if (req.session.flash) {
      res.locals.flash = req.session.flash
      delete req.session.flash
    }
    if (req.session.user) {
      res.locals.user = req.session.user
    }
    next()
  })
  app.use('/', router)
  app.use(function (err, req, res, next) {
    if (err.status === 403) {
      return res
        .status(403)
        .sendFile(join(directoryFullName, 'views', 'errors', '403.html'))
    }
    if (err.status === 404) {
      return res
        .status(404)
        .sendFile(join(directoryFullName, 'views', 'errors', '404.html'))
    }
    if (req.app.get('env') !== 'development') {
      return res
        .status(500)
        .sendFile(join(directoryFullName, 'views', 'errors', '500.html'))
    }
    res.status(err.status || 500).render('errors/error', { error: err })
  })
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
