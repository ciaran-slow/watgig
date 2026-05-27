import request from 'superagent'
import { Event, EventWithId, DetailedEvent } from '../../models/event.ts'

const rootURL = '/api/v1'

export async function getEvents(): Promise<EventWithId[]> {
  const res = await request.get(`${rootURL}/events`)
  return res.body
}

export async function getEventById(id: number): Promise<DetailedEvent> {
  const res = await request.get(`${rootURL}/events/${id}`)
  return res.body
}

export async function getEventsByUser(userId: string): Promise<EventWithId[]> {
  const res = await request.get(`${rootURL}/events/user/${userId}`)
  return res.body
}

export async function addEvent(newEvent: Event, token: string): Promise<EventWithId> {
  const res = await request
    .post(`${rootURL}/events`)
    .set('Authorization', `Bearer ${token}`)
    .send(newEvent)
  return res.body
}

export async function updateEvent(id: number, updatedEvent: Partial<Event>, token: string): Promise<void> {
  await request
    .patch(`${rootURL}/events/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedEvent)
}

export async function deleteEvent(id: number, token: string): Promise<void> {
  await request
    .delete(`${rootURL}/events/${id}`)
    .set('Authorization', `Bearer ${token}`)
}
