import express from 'express'
import * as Path from 'node:path'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'

import eventRoutes from './routes/events.ts'
import userRoutes from './routes/users.ts'
import { getEventById } from './db/events.ts'
import { defaultPage, pageForEvent, renderIndex } from './seo.ts'

const server = express()

server.set('trust proxy', 1)

const auth0Origin = process.env.VITE_AUTH0_DOMAIN
  ? `https://${process.env.VITE_AUTH0_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '')}`
  : 'https://raumati-2026-ciaran.au.auth0.com'

server.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://upload-widget.cloudinary.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        connectSrc: [
          "'self'",
          auth0Origin,
          'https://nominatim.openstreetmap.org',
          'https://tiles.openfreemap.org',
          'https://*.cloudinary.com',
        ],
        workerSrc: ["'self'", 'blob:'],
        childSrc: ["'self'", 'blob:'],
        frameSrc: [auth0Origin, 'https://upload-widget.cloudinary.com', 'https://*.cloudinary.com'],
      },
    },
    crossOriginEmbedderPolicy: false,
    // Send the origin (not full URLs) to third parties such as tile and geocoding servers
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  }),
)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})

server.get('/health', (_req, res) => res.json({ status: 'ok' }))
server.use('/api', limiter)
server.use(express.json({ limit: '64kb' }))

server.use('/api/v1/events', eventRoutes)
server.use('/api/v1/users', userRoutes)

server.use('/api', (_req, res) => {
  res.status(404).json({ message: 'API route not found' })
})

// Global Error Handler
server.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  void _next
  if (err instanceof SyntaxError) {
    return res.status(400).json({ message: 'Invalid JSON body' })
  }
  if (err && typeof err === 'object' && 'name' in err && err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid token' })
  }
  
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? undefined : String(err),
  })
})

if (process.env.NODE_ENV === 'production') {
  server.use(
    '/assets',
    express.static(Path.resolve('./dist/assets'), { maxAge: '1y', immutable: true }),
  )
  // PWA files live in the dist root; serve only these, since dist also holds the server bundle
  server.get(
    ['/manifest.webmanifest', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png', '/og-default.png', '/sw.js', '/offline.html', '/screenshot-home.jpg'],
    (req, res) => {
      // The service worker must always be re-checked so updates roll out promptly
      res.set('Cache-Control', req.path === '/sw.js' ? 'no-cache' : 'public, max-age=3600')
      if (req.path === '/sw.js') res.set('Service-Worker-Allowed', '/')
      res.sendFile(Path.resolve('./dist', req.path.slice(1)))
    },
  )
  const originOf = (req: express.Request) => `${req.protocol}://${req.get('host')}`

  // Event pages: put the event's own title, description and poster into the share tags
  server.get('/event/:id', async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const event = Number.isInteger(id) ? await getEventById(id) : undefined
      if (!event) return next()
      res.set('Cache-Control', 'public, max-age=300')
      res.type('html').send(await renderIndex(pageForEvent(event, originOf(req))))
    } catch (err) {
      next()
    }
  })

  server.get('*', async (req, res) => {
    try {
      res.type('html').send(await renderIndex(defaultPage(originOf(req), req.path)))
    } catch {
      res.sendFile(Path.resolve('./dist/index.html'))
    }
  })
}

export default server
