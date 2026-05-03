import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import server from '../server'
import db from '../db/connection'

// Mock Auth0 with a variable we can control
const mockAuth = { sub: 'auth0|1' }
vi.mock('../auth0', () => ({
  default: (req: any, res: any, next: any) => {
    req.auth = mockAuth
    next()
  }
}))

beforeAll(async () => {
  await db.migrate.latest()
})

beforeEach(async () => {
  await db.seed.run()
  vi.clearAllMocks()
  mockAuth.sub = 'auth0|1' // Reset to Admin User
})

afterAll(async () => {
  await db.destroy()
})

describe('Notification System Integration', () => {
  it('creates in-app notifications to followers when a new event is posted', async () => {
    // 1. Setup: Admin User (id: 1) exists. Let Jane Doe (id: 2) follow him.
    // Ensure Admin User has the auth0Id we are mocking
    await db('users').where({ id: 1 }).update({ auth0Id: 'auth0|1' })
    await db('user_following').insert({ follower_id: 2, followed_id: 1 })

    // 2. Action: Admin User (id: 1) creates a new event
    const newEvent = {
      name: 'Notification Test Concert',
      description: 'A concert to test notifications',
      venue_name: 'Test Venue',
      date: '2026-06-01',
      start_time: '20:00',
      artists: 'The Testers',
      image_url: 'http://example.com/image.jpg',
      ticket_link: 'http://example.com/tickets',
      featured: false,
      created_by: 'auth0|1', // Auth0Id of the creator
    }

    const response = await request(server)
      .post('/api/v1/events')
      .send(newEvent)

    expect(response.status).toBe(201)
    const addedEventId = response.body.id

    // 3. Verify In-App Notification was created for Jane Doe (id: 2)
    const notifications = await db('notifications').where({ user_id: 2, event_id: addedEventId })
    expect(notifications).toHaveLength(1)
    expect(notifications[0].is_read).toBe(0) // sqlite false
  })

  it('marks a notification as read', async () => {
    const [notifId] = await db('notifications').insert({
      user_id: 2,
      event_id: 1,
      is_read: false
    })

    const response = await request(server)
      .patch(`/api/v1/users/notifications/${notifId}`)

    expect(response.status).toBe(200)

    const updatedNotif = await db('notifications').where({ id: notifId }).first()
    expect(updatedNotif.is_read).toBe(1)
  })

  it('retrieves notifications for a user', async () => {
    // Setup Jane
    await db('users').where({ id: 2 }).update({ auth0Id: 'auth0|jane' })
    mockAuth.sub = 'auth0|jane'

    await db('notifications').insert({
      user_id: 2,
      event_id: 1,
      is_read: false
    })

    const response = await request(server)
      .get('/api/v1/users/notifications')

    expect(response.status).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0]).toHaveProperty('event_name')
    expect(response.body[0].creator_name).toBeDefined()
  })
})
