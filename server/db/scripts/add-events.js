// Validated, de-duplicated event insert used by the hourly gig-finder task.
// Usage: node server/db/scripts/add-events.js candidates.json [--apply]
// Without --apply nothing is written. Prints one line per candidate.
import { readFileSync } from 'node:fs'
import knex from 'knex'
import config from '../knexfile.js'
import { uploadToCloudinary } from './optimise-event-images.js'

const GENRES = new Set(['rock', 'pop', 'electronic', 'hiphop', 'acoustic', 'jazz', 'metal', 'other'])
const file = process.argv[2]
const apply = process.argv.includes('--apply')
const env = process.env.NODE_ENV || 'development'
const db = knex(config[env])
const day = (d) => (d instanceof Date ? d.toLocaleDateString('en-CA') : String(d).slice(0, 10))
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const isHttps = (u) => { try { return new URL(u).protocol === 'https:' } catch { return false } }

function problems(e, today) {
  const p = []
  for (const f of ['name', 'date', 'artists', 'venue_name', 'address', 'description', 'ticket_link', 'source_url'])
    if (!e[f] || !String(e[f]).trim()) p.push(`missing ${f}`)
  if (e.date && !/^\d{4}-\d{2}-\d{2}$/.test(e.date)) p.push('date must be YYYY-MM-DD')
  else if (e.date && e.date < today) p.push('date is in the past')
  if (e.start_time && !/^\d{2}:\d{2}$/.test(e.start_time)) p.push('start_time must be HH:MM')
  if (!GENRES.has(e.genre)) p.push(`genre must be one of ${[...GENRES].join(', ')}`)
  if (typeof e.lat !== 'number' || typeof e.lng !== 'number') p.push('lat/lng required (numbers)')
  else if (e.lat > -34 || e.lat < -48 || e.lng < 165 || e.lng > 179) p.push('lat/lng outside New Zealand')
  if (e.ticket_link && !isHttps(e.ticket_link)) p.push('ticket_link must be https')
  if (e.image_url && !isHttps(e.image_url)) p.push('image_url must be https')
  if (e.name && e.name.length > 255) p.push('name too long')
  if (e.artists && e.artists.length > 255) p.push('artists too long')
  return p
}

try {
  const candidates = JSON.parse(readFileSync(file))
  const user = await db('users').where({ name: 'Ciaran Slow' }).first()
  if (!user) throw new Error('User "Ciaran Slow" not found')
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Pacific/Auckland' })
  const existing = await db('event').select('name', 'date', 'venue_name', 'artists')
  const seen = existing.map((e) => `${day(e.date)}|${norm(e.artists || e.name)}`)
  const seenName = new Set(existing.map((e) => `${day(e.date)}|${norm(e.name)}`))
  let added = 0
  for (const e of candidates) {
    const bad = problems(e, today)
    const key = `${e.date}|${norm(e.artists || e.name)}`
    if (!bad.length && (seenName.has(`${e.date}|${norm(e.name)}`) || seen.includes(key))) bad.push('duplicate of an existing event')
    if (bad.length) { console.log(`SKIP  ${e.name || '(no name)'} ${e.date || ''}: ${bad.join('; ')}`); continue }
    const { source_url, ...row } = e
    console.log(`${apply ? 'ADD  ' : 'WOULD'} ${e.name} ${e.date} @ ${e.venue_name} (${source_url})`)
    if (apply) {
      if (row.image_url && !/^https:\/\/res\.cloudinary\.com\//.test(row.image_url)) {
        try { row.image_url = await uploadToCloudinary(row.image_url) } catch (err) { console.log(`  image not re-hosted (${err.message}); keeping original URL`) }
      }
      await db('event').insert({ ...row, created_by: user.id, featured: false })
    }
    seenName.add(`${e.date}|${norm(e.name)}`)
    added++
  }
  console.log(`${apply ? 'Added' : 'Would add'} ${added} of ${candidates.length}`)
} finally {
  await db.destroy()
}
