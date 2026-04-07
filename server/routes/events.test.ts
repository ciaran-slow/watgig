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
  vi.restoreAllMocks()
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

describe('POST /api/v1/events', () => {
  it('adds a new event and returns 201', async () => {
    const newEvent = {
      name: 'Test Event',
      description: 'Test Description',
      venue_name: 'Test Venue',
      date: '2026-04-07',
      start_time: '12:00',
      artists: 'Test Artist',
      image_url: 'http://example.com/image.jpg',
      ticket_link: 'http://example.com/tickets',
      featured: false,
      created_by: '1',
    }

    const response = await request(server)
      .post('/api/v1/events')
      .send(newEvent)

    expect(response.status).toBe(201)

    // Check if the event was actually added
    const eventsResponse = await request(server).get('/api/v1/events')
    const addedEvent = eventsResponse.body.find((e: any) => e.name === 'Test Event')
    expect(addedEvent).toBeDefined()
    expect(addedEvent.venue_name).toBe('Test Venue')
  })

  it('handles database errors gracefully during creation', async () => {
    vi.spyOn(dbMethods, 'addEvent').mockRejectedValue(new Error('Database error'))
    
    const response = await request(server)
      .post('/api/v1/events')
      .send({})

    expect(response.status).toBe(500)
    expect(response.body.message).toBe('Something went wrong')
  })
})
