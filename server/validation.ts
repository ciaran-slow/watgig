import type { Event } from '../models/event.ts'
import type { NewUserData, UserData } from '../models/users.ts'

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

const USER_ROLES = new Set(['user', 'band', 'venue'])
const EVENT_GENRES = new Set([
  'rock',
  'pop',
  'electronic',
  'hiphop',
  'acoustic',
  'jazz',
  'metal',
  'other',
])

type JsonObject = Record<string, unknown>

function object(value: unknown): JsonObject {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ValidationError('Request body must be a JSON object')
  }
  return value as JsonObject
}

function string(
  value: unknown,
  field: string,
  options: { required?: boolean; max: number },
): string | undefined {
  if (value === undefined) {
    if (options.required) throw new ValidationError(`${field} is required`)
    return undefined
  }
  if (typeof value !== 'string') {
    throw new ValidationError(`${field} must be a string`)
  }
  const cleaned = value.trim()
  if (options.required && !cleaned) {
    throw new ValidationError(`${field} is required`)
  }
  if (cleaned.length > options.max) {
    throw new ValidationError(`${field} must be at most ${options.max} characters`)
  }
  return cleaned
}

function url(
  value: unknown,
  field: string,
  options: { required?: boolean; httpsOnly?: boolean } = {},
): string | undefined {
  const cleaned = string(value, field, { required: options.required, max: 2048 })
  if (cleaned === undefined || cleaned === '') return cleaned
  let parsed: URL
  try {
    parsed = new URL(cleaned)
  } catch {
    throw new ValidationError(`${field} must be a valid URL`)
  }
  const allowed = options.httpsOnly
    ? parsed.protocol === 'https:'
    : parsed.protocol === 'https:' || parsed.protocol === 'http:'
  if (!allowed) {
    throw new ValidationError(
      `${field} must use ${options.httpsOnly ? 'HTTPS' : 'HTTP or HTTPS'}`,
    )
  }
  return parsed.toString()
}

function number(value: unknown, field: string): number | undefined {
  if (value === undefined || value === null || value === '') return undefined
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new ValidationError(`${field} must be a finite number`)
  }
  return value
}

function boolean(value: unknown, field: string): boolean | undefined {
  if (value === undefined) return undefined
  if (typeof value !== 'boolean') {
    throw new ValidationError(`${field} must be a boolean`)
  }
  return value
}

function optional(target: JsonObject, key: string, value: unknown) {
  if (value !== undefined) target[key] = value
}

function email(value: unknown, required = false): string | undefined {
  const cleaned = string(value, 'email', { required, max: 320 })
  if (cleaned && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
    throw new ValidationError('email must be valid')
  }
  return cleaned?.toLowerCase()
}

function role(value: unknown, required = false): string | undefined {
  const cleaned = string(value, 'role', { required, max: 20 })
  if (cleaned !== undefined && !USER_ROLES.has(cleaned)) {
    throw new ValidationError('role must be user, band, or venue')
  }
  return cleaned
}

function genre(value: unknown, required = false): string | undefined {
  const cleaned = string(value, 'genre', { required, max: 30 })
  if (cleaned === '') return undefined
  if (cleaned !== undefined && !EVENT_GENRES.has(cleaned)) {
    throw new ValidationError('genre is not supported')
  }
  return cleaned
}

export function parsePositiveId(value: string, field = 'id'): number {
  const parsed = Number(value)
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new ValidationError(`${field} must be a positive integer`)
  }
  return parsed
}

export function validateName(value: unknown): string {
  return string(value, 'name', { required: true, max: 100 }) as string
}

export function validateNewUser(value: unknown): NewUserData {
  const body = object(value)
  return {
    name: string(body.name, 'name', { required: true, max: 100 }) as string,
    email: email(body.email, true) as string,
    role: role(body.role, true) as string,
    profile_image: url(body.profile_image, 'profile_image', {
      required: true,
      httpsOnly: true,
    }) as string,
    bio: string(body.bio, 'bio', { max: 200 }) || '',
    genre: genre(body.genre) || '',
    members: string(body.members, 'members', { max: 255 }) || '',
    address: string(body.address, 'address', { max: 500 }) || '',
  }
}

export function validateUserUpdate(value: unknown): Partial<UserData> {
  const body = object(value)
  const update: JsonObject = {}
  optional(update, 'name', string(body.name, 'name', { max: 100 }))
  optional(update, 'role', role(body.role))
  optional(
    update,
    'profile_image',
    url(body.profile_image, 'profile_image', { httpsOnly: true }),
  )
  optional(update, 'bio', string(body.bio, 'bio', { max: 200 }))
  optional(update, 'genre', genre(body.genre))
  optional(update, 'members', string(body.members, 'members', { max: 255 }))
  optional(update, 'address', string(body.address, 'address', { max: 500 }))
  if (Object.keys(update).length === 0) {
    throw new ValidationError('No editable profile fields were provided')
  }
  return update as Partial<UserData>
}

function eventDate(value: unknown, required = false): string | undefined {
  const cleaned = string(value, 'date', { required, max: 10 })
  if (cleaned === undefined) return undefined
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    throw new ValidationError('date must use YYYY-MM-DD')
  }
  const parsed = new Date(`${cleaned}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== cleaned) {
    throw new ValidationError('date must be a real calendar date')
  }
  return cleaned
}

function eventTime(value: unknown, required = false): string | undefined {
  const cleaned = string(value, 'start_time', { required, max: 5 })
  if (cleaned !== undefined && !/^([01]\d|2[0-3]):[0-5]\d$/.test(cleaned)) {
    throw new ValidationError('start_time must use 24-hour HH:MM')
  }
  return cleaned
}

export function validateEvent(value: unknown, partial = false): Partial<Event> {
  const body = object(value)
  const event: JsonObject = {}
  optional(event, 'name', string(body.name, 'name', { required: !partial, max: 150 }))
  optional(
    event,
    'description',
    string(body.description, 'description', { required: !partial, max: 5000 }),
  )
  optional(
    event,
    'venue_name',
    string(body.venue_name, 'venue_name', { required: !partial, max: 150 }),
  )
  optional(event, 'address', string(body.address, 'address', { required: !partial, max: 500 }))
  optional(event, 'date', eventDate(body.date, !partial))
  optional(event, 'start_time', eventTime(body.start_time, !partial))
  optional(
    event,
    'artists',
    string(body.artists, 'artists', { required: !partial, max: 500 }),
  )
  optional(
    event,
    'image_url',
    url(body.image_url, 'image_url', { required: !partial, httpsOnly: true }),
  )
  optional(event, 'ticket_link', url(body.ticket_link, 'ticket_link'))
  optional(event, 'genre', genre(body.genre, !partial))
  optional(event, 'featured', boolean(body.featured, 'featured'))

  const lat = number(body.lat, 'lat')
  const lng = number(body.lng, 'lng')
  if (lat !== undefined && (lat < -90 || lat > 90)) {
    throw new ValidationError('lat must be between -90 and 90')
  }
  if (lng !== undefined && (lng < -180 || lng > 180)) {
    throw new ValidationError('lng must be between -180 and 180')
  }
  optional(event, 'lat', lat)
  optional(event, 'lng', lng)

  if (partial && Object.keys(event).length === 0) {
    throw new ValidationError('No editable event fields were provided')
  }
  return event as Partial<Event>
}
