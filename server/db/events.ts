import db from './connection.ts'
import {EventWithId, Event} from '../../models/event.ts'

export async function getEvents(): Promise<EventWithId[]> {
    return db('event').select()
}

export async function getEventById(id: number): Promise<EventWithId & { creator_name?: string, creator_image?: string }> {
    return db('event')
        .join('users', 'event.created_by', 'users.id')
        .where('event.id', id)
        .select('event.*', 'users.name as creator_name', 'users.profile_image as creator_image')
        .first()
}

export async function getEventsByUserId(userId: string | number): Promise<EventWithId[]> {
    return db('event').where('created_by', userId).select()
}

export async function addEvent(event: Event): Promise<EventWithId> {
    const [addedEvent] = await db('event')
        .insert(event)
        .returning('*')
    return addedEvent
}

export async function deleteEvent(id: number): Promise<number> {
    return db('event').where('id', id).delete()
}

export async function updateEvent(id: number, event: Partial<Event>): Promise<number> {
    return db('event').where('id', id).update(event)
}

// Following / Saved Events
export async function followEvent(userId: number, eventId: number) {
    return db('following').insert({ user_id: userId, event_id: eventId })
}

export async function unfollowEvent(userId: number, eventId: number) {
    return db('following').where({ user_id: userId, event_id: eventId }).delete()
}

export async function getFollowedEvents(userId: number): Promise<EventWithId[]> {
    return db('event')
        .join('following', 'event.id', 'following.event_id')
        .where('following.user_id', userId)
        .select('event.*')
}