import db from './connection.ts'
import {EventWithId} from '../../models/event.ts'

export async function getEvents(): Promise<EventWithId[]> {
    return db('event').select()
}