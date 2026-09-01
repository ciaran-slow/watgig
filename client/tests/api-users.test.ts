// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import nock from 'nock'
import * as api from '../apis/users'

describe('getUser', () => {
  it('returns the user from the API', async () => {
    const mockUser = { name: 'Admin User' }
    const scope = nock('http://api')
      .get('/v1/users')
      .reply(200, { user: mockUser })

    const user = await api.getUser({ token: 'test-token' })
    expect(user).toEqual(mockUser)
    expect(scope.isDone()).toBe(true)
  })

  it('returns null if no user is found', async () => {
    const scope = nock('http://api')
      .get('/v1/users')
      .reply(200, {})

    const user = await api.getUser({ token: 'test-token' })
    expect(user).toBeNull()
    expect(scope.isDone()).toBe(true)
  })
})

describe('getUserDetails', () => {
  it('returns user details from the API', async () => {
    const mockDetails = { id: 1, name: 'Admin User', follower_count: 5 }
    const scope = nock('http://api')
      .get('/v1/users/details/1')
      .reply(200, mockDetails)

    const details = await api.getUserDetails(1)
    expect(details).toEqual(mockDetails)
    expect(scope.isDone()).toBe(true)
  })
})

describe('checkName', () => {
  it('returns availability and suggestions', async () => {
    const mockResponse = { available: false, suggestions: ['user1', 'user2'] }
    const scope = nock('http://api')
      .get('/v1/users/check-name/test')
      .reply(200, mockResponse)

    const result = await api.checkName({ name: 'test', token: 'token' })
    expect(result).toEqual(mockResponse)
    expect(scope.isDone()).toBe(true)
  })
})
