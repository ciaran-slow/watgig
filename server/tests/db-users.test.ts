import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import db from '../db/connection'
import * as users from '../db/users'

beforeAll(async () => {
  await db.migrate.latest()
})

beforeEach(async () => {
  await db.seed.run()
})

afterAll(async () => {
  await db.destroy()
})

describe('getUserById', () => {
  it('returns a user by auth0Id', async () => {
    // Note: Seeded users don't have auth0Id yet, so we add one
    await db('users').where('id', 1).update({ auth0Id: 'auth0|123' })
    const user = await users.getUserById('auth0|123')
    expect(user.name).toBe('Admin User')
  })
})

describe('getUserDetailsById', () => {
  it('returns user details including follower count', async () => {
    const user = await users.getUserDetailsById(1)
    expect(user.name).toBe('Admin User')
    expect(user).toHaveProperty('follower_count')
  })
})

describe('getUserByName', () => {
  it('returns a user by name', async () => {
    const user = await users.getUserByName('Jane Doe')
    expect(user.id).toBe(2)
  })
})

describe('addUser', () => {
  it('adds a new user', async () => {
    const newUser = {
      name: 'New User',
      email: 'new@example.com',
      role: 'user',
      auth0Id: 'auth0|999',
    }
    const addedUser = await users.addUser(newUser)
    expect(addedUser.name).toBe('New User')
    
    const user = await users.getUserById('auth0|999')
    expect(user).toBeDefined()
  })
})

describe('follow/unfollow', () => {
  it('allows following and unfollowing a user', async () => {
    await users.followUser(1, 2)
    let following = await users.getFollowing(1)
    expect(following.some(u => u.id === 2)).toBe(true)

    await users.unfollowUser(1, 2)
    following = await users.getFollowing(1)
    expect(following.some(u => u.id === 2)).toBe(false)
  })
})
