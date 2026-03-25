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

export default router
