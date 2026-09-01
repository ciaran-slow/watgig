import { Response, Router } from 'express'
import checkJwt, { JwtRequest } from '../auth0.ts'
import { Event } from '../../models/event.ts'

import * as db from '../db/events.ts'
import * as dbUsers from '../db/users.ts'
import * as dbNotif from '../db/notifications.ts'
import { parsePositiveId, validateEvent, ValidationError } from '../validation.ts'

const router = Router()

function handleRouteError(error: unknown, res: Response) {
  if (error instanceof ValidationError) {
    return res.status(400).json({ message: error.message })
  }
  return res.status(500).json({ message: 'Something went wrong' })
}

async function geocode(address: string) {
  const geoRes = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
    {
      headers: { 'User-Agent': 'WatGig-App/1.0' },
      signal: AbortSignal.timeout(5000),
    },
  )
  if (!geoRes.ok) return {}
  const data = (await geoRes.json()) as Array<{ lat: string; lon: string }>
  if (!data[0]) return {}
  return { lat: Number(data[0].lat), lng: Number(data[0].lon) }
}

router.get('/', async (req, res) => {
  try {
    const events = await db.getEvents()

    res.json(events)
  } catch (error) {
    handleRouteError(error, res)
  }
})

router.get('/user/:userId', async (req, res) => {
  try {
    const userId = parsePositiveId(req.params.userId, 'user id')
    const events = await db.getEventsByUserId(userId)
    res.json(events)
  } catch (error) {
    handleRouteError(error, res)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = parsePositiveId(req.params.id, 'event id')
    const event = await db.getEventById(id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.json(event)
  } catch (error) {
    handleRouteError(error, res)
  }
})

router.post('/', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0Id = req.auth?.sub

    if (!auth0Id) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const user = await dbUsers.getUserById(auth0Id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const newEvent = validateEvent(req.body)
    if (user.role !== 'admin') newEvent.featured = false

    // Geocode address if provided
    let lat = newEvent.lat
    let lng = newEvent.lng

    if (newEvent.address && (lat === undefined || lng === undefined)) {
      try {
        const result = await geocode(newEvent.address)
        lat = result.lat
        lng = result.lng
      } catch (geoError) {
        // Silent fail for background tasks
      }
    }

    const addedEvent = await db.addEvent({
      ...newEvent,
      created_by: user.id,
      lat,
      lng
    } as Event)

    // Notify followers
    try {
      const followers = await dbUsers.getFollowers(user.id)
      await dbNotif.createNotifications(
        followers.map((follower) => follower.id),
        addedEvent.id,
      )
    } catch (notifError) {
      // Silent fail for background tasks
    }

    res.status(201).json(addedEvent)
  } catch (error) {
    handleRouteError(error, res)
  }
})

router.patch('/:id', checkJwt, async (req: JwtRequest, res) => {
  try {
    const id = parsePositiveId(req.params.id, 'event id')
    const auth0Id = req.auth?.sub

    const user = await dbUsers.getUserById(auth0Id as string)
    const event = await db.getEventById(id)

    if (!event || !user || event.created_by !== user.id) {
      return res.status(403).json({ message: 'Unauthorized' })
    }
    const updatedEvent = validateEvent(req.body, true)
    if (user.role !== 'admin') delete updatedEvent.featured

    // Geocode if address is being updated
    if (updatedEvent.address && (updatedEvent.lat === undefined || updatedEvent.lng === undefined)) {
      try {
        Object.assign(updatedEvent, await geocode(updatedEvent.address))
      } catch (geoError) {
        // Silent fail for background tasks
      }
    }

    await db.updateEvent(id, updatedEvent)
    res.sendStatus(204)
  } catch (error) {
    handleRouteError(error, res)
  }
})

router.delete('/:id', checkJwt, async (req: JwtRequest, res) => {
  try {
    const id = parsePositiveId(req.params.id, 'event id')
    const auth0Id = req.auth?.sub

    const user = await dbUsers.getUserById(auth0Id as string)
    const event = await db.getEventById(id)

    if (!event || !user || event.created_by !== user.id) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    await db.deleteEvent(id)
    res.sendStatus(204)
  } catch (error) {
    handleRouteError(error, res)
  }
})

export default router
