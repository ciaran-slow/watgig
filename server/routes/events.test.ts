import { describe, it, expect, beforeAll, beforeEach, afterAll, vi } from 'vitest'
import request from 'supertest'
import server from '../server'
import db from '../db/connection'
import * as dbMethods from '../db/events'

beforeAll(async () => {
  await db.migrate.latest()
})

beforeEach(async () => {
  await db.seed.run()
  vi.clearAllMocks()
})

afterAll(async () => {
  await db.destroy()
})

describe('GET /api/v1/events', () => {
  it('returns all events from the database', async () => {
    const response = await request(server).get('/api/v1/events')
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(20)
    expect(response.body[0].name).toBe('Midnight Riot')
  })

  it('handles database errors gracefully', async () => {
    // Mock getEvents to throw an error
    vi.spyOn(dbMethods, 'getEvents').mockRejectedValue(new Error('Database error'))
    
    const response = await request(server).get('/api/v1/events')
    expect(response.status).toBe(500)
    expect(response.body.message).toBe('Something went wrong')
  })
})
