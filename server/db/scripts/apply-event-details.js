// Usage: node server/db/scripts/apply-event-details.js [--apply]
import { readFileSync } from 'node:fs'
import knex from 'knex'
import config from '../knexfile.js'

const apply = process.argv.includes('--apply')
const env = process.env.NODE_ENV || 'development'
const db = knex(config[env])
const load = (f) => JSON.parse(readFileSync(new URL(f, import.meta.url)))
const venues = load('./venues.json')
const details = load('./nz-events-details.json')
const day = (d) => (d instanceof Date ? d.toLocaleDateString('en-CA') : String(d).slice(0, 10))

try {
  const user = await db('users').where({ name: 'Ciaran Slow' }).first()
  const events = await db('event').where({ created_by: user.id })
  for (const d of details) {
    const row = events.find((e) => e.name === d.match[0] && day(e.date) === d.match[1])
    if (!row) { console.log('NOT FOUND', d.match.join(' ')); continue }
    const v = venues[d.venue]
    const parts = [d.blurb, d.times, `Venue: ${d.venue}, ${v.address}.`]
    parts.push(v.access ? `Accessibility: ${v.access}` : 'Accessibility: contact the venue for access information before booking.')
    parts.push('Check the ticket link for the latest times, age restrictions and entry conditions.')
    const set = {
      address: v.address, lat: v.lat, lng: v.lng,
      image_url: d.image_url, ticket_link: d.ticket_link,
      description: parts.join('\n\n'),
    }
    if (d.start_time) set.start_time = d.start_time
    console.log(`${apply ? 'update' : 'would update'} #${row.id} ${d.match[0]}`)
    if (apply) await db('event').where({ id: row.id }).update(set)
  }
} finally {
  await db.destroy()
}
