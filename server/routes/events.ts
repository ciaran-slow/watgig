import { Router } from 'express'
import checkJwt, { JwtRequest } from '../auth0.ts'

import * as db from '../db/events.ts'
import * as dbUsers from '../db/users.ts'
import * as dbNotif from '../db/notifications.ts'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const events = await db.getEvents()

    res.json(events)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const event = await db.getEventById(id)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.json(event)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const events = await db.getEventsByUserId(userId)
    res.json(events)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.post('/', checkJwt, async (req: JwtRequest, res) => {
  try {
    const newEvent = req.body
    const auth0Id = req.auth?.sub

    if (!auth0Id) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const user = await dbUsers.getUserById(auth0Id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Geocode address if provided
    let lat = newEvent.lat
    let lng = newEvent.lng

    if (newEvent.address && (!lat || !lng)) {
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            newEvent.address
          )}&limit=1`,
          {
            headers: {
              'User-Agent': 'WatGig-App/1.0'
            }
          }
        )
        const data = await geoRes.json()
        if (data && data.length > 0) {
          lat = parseFloat(data[0].lat)
          lng = parseFloat(data[0].lon)
        }
      } catch (geoError) {
        // Silent fail for background tasks
      }
    }

    const addedEvent = await db.addEvent({
      ...newEvent,
      created_by: user.id,
      lat,
      lng
    })

    // Notify followers
    try {
      const followers = await dbUsers.getFollowers(user.id)
      for (const follower of followers) {
        await dbNotif.createNotification(follower.id, addedEvent.id)
      }
    } catch (notifError) {
      // Silent fail for background tasks
    }

    res.status(201).json(addedEvent)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.patch('/:id', checkJwt, async (req: JwtRequest, res) => {
  try {
    const id = Number(req.params.id)
    const updatedEvent = req.body
    const auth0Id = req.auth?.sub

    const user = await dbUsers.getUserById(auth0Id as string)
    const event = await db.getEventById(id)

    if (!event || !user || event.created_by !== user.id) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    // Geocode if address is being updated
    if (updatedEvent.address && (!updatedEvent.lat || !updatedEvent.lng)) {
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            updatedEvent.address
          )}&limit=1`,
          {
            headers: {
              'User-Agent': 'WatGig-App/1.0'
            }
          }
        )
        const data = await geoRes.json()
        if (data && data.length > 0) {
          updatedEvent.lat = parseFloat(data[0].lat)
          updatedEvent.lng = parseFloat(data[0].lon)
        }
      } catch (geoError) {
        // Silent fail for background tasks
      }
    }

    await db.updateEvent(id, updatedEvent)
    res.sendStatus(200)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.delete('/:id', checkJwt, async (req: JwtRequest, res) => {
  try {
    const id = Number(req.params.id)
    const auth0Id = req.auth?.sub

    const user = await dbUsers.getUserById(auth0Id as string)
    const event = await db.getEventById(id)

    if (!event || !user || event.created_by !== user.id) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    await db.deleteEvent(id)
    res.sendStatus(200)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default router
