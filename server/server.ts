import express from 'express'
import * as Path from 'node:path'
import { rateLimit } from 'express-rate-limit'

import eventRoutes from './routes/events.ts'
import userRoutes from './routes/users.ts'

const server = express()

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

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server
