import express from 'express'
import * as Path from 'node:path'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'

import eventRoutes from './routes/events.ts'
import userRoutes from './routes/users.ts'

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
          'https://*.cloudinary.com',
        ],
        frameSrc: [auth0Origin, 'https://upload-widget.cloudinary.com', 'https://*.cloudinary.com'],
      },
    },
    crossOriginEmbedderPolicy: false,
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
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server
