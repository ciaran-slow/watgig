import express from 'express'
import * as Path from 'node:path'
import { rateLimit } from 'express-rate-limit'

import eventRoutes from './routes/events.ts'
import userRoutes from './routes/users.ts'

const server = express()

server.set('trust proxy', 1)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})

server.use(limiter)
server.use(express.json())

server.use('/api/v1/events', eventRoutes)
server.use('/api/v1/users', userRoutes)

// Global Error Handler
server.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    console.error('Auth0 Error:', err.message)
    return res.status(401).json({ message: 'Invalid token' })
  }
  
  console.error('Unhandled Error:', err)
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err 
  })
})

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server
