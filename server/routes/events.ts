import { Router } from 'express'

import * as db from '../db/events.ts'
import * as dbUsers from '../db/users.ts'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const events = await db.getEvents()

    res.json(events)
  } catch (error) {
    console.log(error)
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
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const events = await db.getEventsByUserId(userId)
    res.json(events)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.post('/', async (req, res) => {
  try {
    const newEvent = req.body
    const auth0Id = newEvent.created_by
    const user = await dbUsers.getUserById(auth0Id)

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
        console.error('Background geocoding failed:', geoError)
        // We continue anyway, the map will just handle the missing coords
      }
    }

    const addedEvent = await db.addEvent({
      ...newEvent,
      created_by: user?.id || 1,
      lat,
      lng
    })
    res.status(201).json(addedEvent)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const updatedEvent = req.body

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
        console.error('Background geocoding failed during update:', geoError)
      }
    }

    await db.updateEvent(id, updatedEvent)
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    await db.deleteEvent(id)
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default router
