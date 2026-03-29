import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import db from './connection'
import { getEvents } from './events'

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
