import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import server from '../server'
import * as dbUsers from '../db/users'

vi.mock('../auth0', () => ({
  default: (req: any, res: any, next: any) => {
    req.auth = { sub: 'auth0|123' }
    next()
  }
}))

vi.mock('../db/users')
vi.mock('../db/events')

beforeEach(() => {
  vi.resetAllMocks()
})

describe('GET /api/v1/users', () => {
  it('returns the current user', async () => {
    const mockUser = { id: 1, name: 'Admin User', auth0Id: 'auth0|123' }
    vi.mocked(dbUsers.getUserById).mockResolvedValue(mockUser as any)

    const response = await request(server)
      .get('/api/v1/users')
      .set('Authorization', 'Bearer token')

    expect(response.status).toBe(200)
    expect(response.body.user.name).toBe('Admin User')
  })

  it('handles errors', async () => {
    vi.mocked(dbUsers.getUserById).mockRejectedValue(new Error('DB Error'))
    const response = await request(server).get('/api/v1/users')
    expect(response.status).toBe(500)
  })
})

describe('GET /api/v1/users/details/:id', () => {
  it('returns user details', async () => {
    const mockUser = { id: 1, name: 'Admin User' }
    vi.mocked(dbUsers.getUserDetailsById).mockResolvedValue(mockUser as any)

    const response = await request(server).get('/api/v1/users/details/1')

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Admin User')
  })

  it('returns 404 if user not found', async () => {
    vi.mocked(dbUsers.getUserDetailsById).mockResolvedValue(null as any)
    const response = await request(server).get('/api/v1/users/details/999')
    expect(response.status).toBe(404)
  })
})

describe('POST /api/v1/users', () => {
  it('adds a new user', async () => {
    const newUser = {
      name: 'New User',
      email: 'new@example.com',
      role: 'user',
      profile_image: 'https://example.com/profile.jpg',
      bio: '',
      genre: '',
      members: '',
      address: '',
    }
    vi.mocked(dbUsers.getUserById).mockResolvedValue(undefined)
    vi.mocked(dbUsers.getUserByName).mockResolvedValue(undefined)
    vi.mocked(dbUsers.addUser).mockResolvedValue({ ...newUser, id: 2, auth0Id: 'auth0|123' } as any)

    const response = await request(server)
      .post('/api/v1/users')
      .send(newUser)

    expect(response.status).toBe(201)
    expect(response.body.user.name).toBe('New User')
  })
})
