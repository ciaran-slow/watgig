import express, { Response } from 'express'
import checkJwt, { JwtRequest } from '../auth0.ts'

import * as db from '../db/users.ts'
import * as dbEvents from '../db/events.ts'
import * as dbNotif from '../db/notifications.ts'
import {
  parsePositiveId,
  validateName,
  validateNewUser,
  validateUserUpdate,
  ValidationError,
} from '../validation.ts'

const router = express.Router()

function handleRouteError(error: unknown, res: Response) {
  if (error instanceof ValidationError) {
    return res.status(400).json({ message: error.message })
  }
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    (error.code === '23505' || error.code === 'SQLITE_CONSTRAINT')
  ) {
    return res.status(409).json({ message: 'That record already exists' })
  }
  return res.status(500).json({ message: 'Something went wrong' })
}

function publicUser(user: NonNullable<Awaited<ReturnType<typeof db.getUserById>>>) {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    profile_image: user.profile_image,
    bio: user.bio,
    genre: user.genre,
    members: user.members,
    address: user.address,
  }
}

// GET /api/v1/users
router.get('/', checkJwt, async (req: JwtRequest, res) => {
  try {
    const user = await db.getUserById(req.auth?.sub || '')
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ user: publicUser(user) })
  } catch (error) {
    handleRouteError(error, res)
  }
})

router.get('/details/:id', async (req, res) => {
  try {
    const id = parsePositiveId(req.params.id, 'user id')
    const user = await db.getUserDetailsById(id)
    if (!user) {
      return res.status(404).send('User not found')
    }

    res.json(user)
  } catch (error) {
    handleRouteError(error, res)
  }
})

router.get('/check-name/:name', checkJwt, async (req: JwtRequest, res) => {
  try {
    const name = validateName(req.params.name)
    const user = await db.getUserByName(name)
    
    if (!user) {
      return res.json({ available: true })
    }

    // Generate suggestions
    const suggestions = []
    let i = 1
    while (suggestions.length < 3 && i < 25) {
      const suggestion = `${name}${i}`
      const existing = await db.getUserByName(suggestion)
      if (!existing) {
        suggestions.push(suggestion)
      }
      i++
    }

    res.json({ available: false, suggestions })
  } catch (error) {
    handleRouteError(error, res)
  }
})

router.post('/', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0Id = req.auth?.sub
    if (!auth0Id) return res.status(401).json({ message: 'Unauthorized' })
    if (await db.getUserById(auth0Id)) {
      return res.status(409).json({ message: 'Profile already exists' })
    }

    const newUser = validateNewUser(req.body)
    if (await db.getUserByName(newUser.name)) {
      return res.status(409).json({ message: 'Name is already taken' })
    }

    const user = await db.addUser({
      ...newUser,
      auth0Id,
    })

    res.status(201).json({ user: publicUser(user) })
  } catch (error) {
    handleRouteError(error, res)
  }
})

router.patch('/', checkJwt, async (req: JwtRequest, res) => {
  try {
    const user = await db.getUserById(req.auth?.sub || '')
    if (!user) return res.status(404).send('User not found')

    const updatedUser = validateUserUpdate(req.body)
    if (typeof updatedUser.name === 'string' && updatedUser.name !== user.name) {
      if (await db.getUserByName(updatedUser.name)) {
        return res.status(409).json({ message: 'Name is already taken' })
      }
    }
    await db.updateUser(user.id, updatedUser)
    res.sendStatus(204)
  } catch (error) {
    handleRouteError(error, res)
  }
})

router.delete('/', checkJwt, async (req: JwtRequest, res) => {
  try {
    const user = await db.getUserById(req.auth?.sub || '')
    if (!user) return res.status(404).send('User not found')

    await db.deleteUser(user.id)
    res.sendStatus(204)
  } catch (error) {
    handleRouteError(error, res)
  }
})

// Saved Events
router.get('/saved', checkJwt, async (req: JwtRequest, res) => {
  try {
    const user = await db.getUserById(req.auth?.sub || '')
    if (!user) return res.status(404).send('User not found')

    const events = await dbEvents.getFollowedEvents(user.id)
    res.json(events)
  } catch (error) {
    handleRouteError(error, res)
  }
})

router.post('/saved/:eventId', checkJwt, async (req: JwtRequest, res) => {
  try {
    const user = await db.getUserById(req.auth?.sub || '')
    if (!user) return res.status(404).send('User not found')
    const eventId = parsePositiveId(req.params.eventId, 'event id')
    if (!(await dbEvents.getEventById(eventId))) {
      return res.status(404).json({ message: 'Event not found' })
    }

    await dbEvents.followEvent(user.id, eventId)
    res.sendStatus(201)
  } catch (error) {
    handleRouteError(error, res)
  }
})

router.delete('/saved/:eventId', checkJwt, async (req: JwtRequest, res) => {
  try {
    const eventId = parsePositiveId(req.params.eventId, 'event id')
    const user = await db.getUserById(req.auth?.sub || '')
    if (!user) return res.status(404).send('User not found')

    await dbEvents.unfollowEvent(user.id, eventId)
    res.sendStatus(204)
  } catch (error) {
    handleRouteError(error, res)
  }
})

// User Following
router.get('/following', checkJwt, async (req: JwtRequest, res) => {
  try {
    const user = await db.getUserById(req.auth?.sub || '')
    if (!user) return res.status(404).send('User not found')

    const following = await db.getFollowing(user.id)
    res.json(following)
  } catch (error) {
    handleRouteError(error, res)
  }
})

router.post('/follow/:userId', checkJwt, async (req: JwtRequest, res) => {
  try {
    const followedId = parsePositiveId(req.params.userId, 'user id')
    const user = await db.getUserById(req.auth?.sub || '')
    if (!user) return res.status(404).send('User not found')
    if (followedId === user.id) {
      return res.status(400).json({ message: 'You cannot follow yourself' })
    }
    if (!(await db.getUserDetailsById(followedId))) {
      return res.status(404).json({ message: 'User not found' })
    }

    await db.followUser(user.id, followedId)
    res.sendStatus(201)
  } catch (error) {
    handleRouteError(error, res)
  }
})

router.delete('/follow/:userId', checkJwt, async (req: JwtRequest, res) => {
  try {
    const followedId = parsePositiveId(req.params.userId, 'user id')
    const user = await db.getUserById(req.auth?.sub || '')
    if (!user) return res.status(404).send('User not found')

    await db.unfollowUser(user.id, followedId)
    res.sendStatus(204)
  } catch (error) {
    handleRouteError(error, res)
  }
})

// Notifications
router.get('/notifications', checkJwt, async (req: JwtRequest, res) => {
  try {
    const user = await db.getUserById(req.auth?.sub || '')
    if (!user) return res.status(404).send('User not found')

    const notifications = await dbNotif.getNotifications(user.id)
    res.json(notifications)
  } catch (error) {
    handleRouteError(error, res)
  }
})

router.patch('/notifications/:id', checkJwt, async (req: JwtRequest, res) => {
  try {
    const user = await db.getUserById(req.auth?.sub || '')
    if (!user) return res.status(404).send('User not found')
    const changed = await dbNotif.markAsRead(
      parsePositiveId(req.params.id, 'notification id'),
      user.id,
    )
    if (!changed) return res.status(404).json({ message: 'Notification not found' })
    res.sendStatus(204)
  } catch (error) {
    handleRouteError(error, res)
  }
})

router.delete('/notifications/:id', checkJwt, async (req: JwtRequest, res) => {
  try {
    const user = await db.getUserById(req.auth?.sub || '')
    if (!user) return res.status(404).send('User not found')
    const changed = await dbNotif.deleteNotification(
      parsePositiveId(req.params.id, 'notification id'),
      user.id,
    )
    if (!changed) return res.status(404).json({ message: 'Notification not found' })
    res.sendStatus(204)
  } catch (error) {
    handleRouteError(error, res)
  }
})

export default router
