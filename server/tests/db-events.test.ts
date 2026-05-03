import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import db from '../db/connection'
import { getEvents, addEvent } from '../db/events'

beforeAll(async () => {
  await db.migrate.latest()
})

beforeEach(async () => {
  await db.seed.run()
})

afterAll(async () => {
  await db.destroy()
})

describe('getEvents', () => {
  it('returns all events from the database', async () => {
    const events = await getEvents()
    expect(events).toHaveLength(20)
    expect(events[0].name).toBe('Midnight Riot')
    expect(events[1].name).toBe('Neon Pulse')
  })

  it('returns events with the correct properties', async () => {
    const events = await getEvents()
    const firstEvent = events[0]
    
    expect(firstEvent).toHaveProperty('id')
    expect(firstEvent).toHaveProperty('name')
    expect(firstEvent).toHaveProperty('date')
    expect(firstEvent).toHaveProperty('venue_name')
  })
})

describe('addEvent', () => {
  it('adds a new event to the database', async () => {
    const newEvent = {
      name: 'Test Event',
      description: 'Test Description',
      venue_name: 'Test Venue',
      genre: 'rock',
      date: '2026-04-07',
      start_time: '12:00',
      artists: 'Test Artist',
      image_url: 'http://example.com/image.jpg',
      ticket_link: 'http://example.com/tickets',
      featured: false,
      created_by: '1',
    }

    const addedEventResult = await addEvent(newEvent)
    const newId = addedEventResult.id
    const events = await getEvents()
    const addedEvent = events.find((e) => e.id === newId)

    expect(addedEvent).toBeDefined()
    expect(addedEvent?.name).toBe('Test Event')
    expect(addedEvent?.venue_name).toBe('Test Venue')
  })
})
