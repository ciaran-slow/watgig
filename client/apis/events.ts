import request from 'superagent'
import { Event, EventWithId } from '../../models/event.ts'

const rootURL = '/api/v1'

export async function getEvents(): Promise<EventWithId[]> {
  const res = await request.get(`${rootURL}/events`)
  return res.body
}

export async function getEventById(id: number): Promise<EventWithId> {
  const res = await request.get(`${rootURL}/events/${id}`)
  return res.body
}

export async function getEventsByUser(userId: string): Promise<EventWithId[]> {
  const res = await request.get(`${rootURL}/events/user/${userId}`)
  return res.body
}

export async function addEvent(newEvent: Event): Promise<EventWithId> {
  const res = await request.post(`${rootURL}/events`).send(newEvent)
  return res.body
}

export async function updateEvent(id: number, updatedEvent: Partial<Event>): Promise<void> {
  await request.patch(`${rootURL}/events/${id}`).send(updatedEvent)
}

export async function deleteEvent(id: number): Promise<void> {
  await request.delete(`${rootURL}/events/${id}`)
}
