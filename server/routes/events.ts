import { Router } from 'express'

import * as db from '../db/events.ts'

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

router.post('/', async (req, res) => {
  try {
    const newEvent = req.body
    const addedEvent = await db.addEvent(newEvent)
    res.status(201).json(addedEvent)
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
