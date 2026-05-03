import express from 'express'
import { JwtRequest } from '../auth0.js'
import checkJwt from '../auth0.js'

import * as db from '../db/users.ts'
import * as dbEvents from '../db/events.ts'
import * as dbNotif from '../db/notifications.ts'

const router = express.Router()

// GET /api/v1/users
router.get('/', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0Id = req.auth?.sub
    const user = await db.getUserById(auth0Id as string)
    console.log(user)
    res.json({ user })
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})

router.get('/details/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const user = await db.getUserDetailsById(id)
    if (!user) {
      return res.status(404).send('User not found')
    }
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})

router.get('/check-name/:name', checkJwt, async (req: JwtRequest, res) => {
  try {
    const { name } = req.params
    const user = await db.getUserByName(name)
    
    if (!user) {
      return res.json({ available: true })
    }

    // Generate suggestions
    const suggestions = []
    let i = 1
    while (suggestions.length < 3 && i < 100) {
      const suggestion = `${name}${i}`
      const existing = await db.getUserByName(suggestion)
      if (!existing) {
        suggestions.push(suggestion)
      }
      i++
    }

    res.json({ available: false, suggestions })
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})

router.post('/', checkJwt, async (req: JwtRequest, res) => {
  try {
    const newUser = req.body
    const auth0Id = req.auth?.sub

    const user = await db.addUser({
      ...newUser,
      auth0Id,
    })

    res.json({ user })
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})

router.patch('/', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0Id = req.auth?.sub
    const updatedUser = req.body
    const user = await db.getUserById(auth0Id as string)
    if (!user) return res.status(404).send('User not found')

    await db.updateUser(user.id, updatedUser)
    res.sendStatus(200)
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})

router.delete('/', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0Id = req.auth?.sub
    const user = await db.getUserById(auth0Id as string)
    if (!user) return res.status(404).send('User not found')

    await db.deleteUser(user.id)
    res.sendStatus(200)
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})

// Saved Events
router.get('/saved', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0Id = req.auth?.sub
    const user = await db.getUserById(auth0Id as string)
    if (!user) return res.status(404).send('User not found')

    const events = await dbEvents.getFollowedEvents(user.id)
    res.json(events)
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})

router.post('/saved/:eventId', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0Id = req.auth?.sub
    const eventId = Number(req.params.eventId)
    const user = await db.getUserById(auth0Id as string)
    if (!user) return res.status(404).send('User not found')

    await dbEvents.followEvent(user.id, eventId)
    res.sendStatus(201)
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})

router.delete('/saved/:eventId', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0Id = req.auth?.sub
    const eventId = Number(req.params.eventId)
    const user = await db.getUserById(auth0Id as string)
    if (!user) return res.status(404).send('User not found')

    await dbEvents.unfollowEvent(user.id, eventId)
    res.sendStatus(200)
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})

// User Following
router.get('/following', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0Id = req.auth?.sub
    const user = await db.getUserById(auth0Id as string)
    if (!user) return res.status(404).send('User not found')

    const following = await db.getFollowing(user.id)
    res.json(following)
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})

router.post('/follow/:userId', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0Id = req.auth?.sub
    const followedId = Number(req.params.userId)
    const user = await db.getUserById(auth0Id as string)
    if (!user) return res.status(404).send('User not found')

    await db.followUser(user.id, followedId)
    res.sendStatus(201)
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})

router.delete('/follow/:userId', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0Id = req.auth?.sub
    const followedId = Number(req.params.userId)
    const user = await db.getUserById(auth0Id as string)
    if (!user) return res.status(404).send('User not found')

    await db.unfollowUser(user.id, followedId)
    res.sendStatus(200)
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})

// Notifications
router.get('/notifications', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0Id = req.auth?.sub
    const user = await db.getUserById(auth0Id as string)
    if (!user) return res.status(404).send('User not found')

    const notifications = await dbNotif.getNotifications(user.id)
    res.json(notifications)
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})

router.patch('/notifications/:id', checkJwt, async (req: JwtRequest, res) => {
  try {
    const id = Number(req.params.id)
    await dbNotif.markAsRead(id)
    res.sendStatus(200)
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})

router.delete('/notifications/:id', checkJwt, async (req: JwtRequest, res) => {
  try {
    const id = Number(req.params.id)
    await dbNotif.deleteNotification(id)
    res.sendStatus(200)
  } catch (error) {
    console.error(error)
    res.status(500).send('Something went wrong')
  }
})

export default router