import db from './connection.ts'
import {EventWithId, Event} from '../../models/event.ts'

export async function getEvents(): Promise<EventWithId[]> {
    return db('event').select()
}

export async function addEvent(event: Event): Promise<EventWithId> {
    const [id] = await db('event').insert(event)
    return { ...event, id }
}

export async function deleteEvent(id: number): Promise<number> {
    return db('event').where('id', id).delete()
}