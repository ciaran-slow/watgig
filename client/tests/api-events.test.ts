// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import nock from 'nock'
import * as api from '../apis/events'

const mockEvents = [
  { id: 1, name: 'Event 1' },
  { id: 2, name: 'Event 2' },
]

describe('getEvents', () => {
  it('returns events from the API', async () => {
    const scope = nock('http://api')
      .get('/v1/events')
      .reply(200, mockEvents)

    const events = await api.getEvents()
    expect(events).toEqual(mockEvents)
    expect(scope.isDone()).toBe(true)
  })
})

describe('getEventById', () => {
  it('returns a single event from the API', async () => {
    const scope = nock('http://api')
      .get('/v1/events/1')
      .reply(200, mockEvents[0])

    const event = await api.getEventById(1)
    expect(event).toEqual(mockEvents[0])
    expect(scope.isDone()).toBe(true)
  })
})

describe('addEvent', () => {
  it('posts a new event to the API', async () => {
    const newEvent = { name: 'New Event' }
    const scope = nock('http://api')
      .post('/v1/events', newEvent)
      .reply(201, { ...newEvent, id: 3 })

    const result = await api.addEvent(newEvent as any, 'test-token')
    expect(result.id).toBe(3)
    expect(scope.isDone()).toBe(true)
  })
})
