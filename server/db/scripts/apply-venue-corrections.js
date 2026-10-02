// Usage: node server/db/scripts/apply-venue-corrections.js [--apply]
// Corrects address/lat/lng (verified against OpenStreetMap) and marks featured events.
import { readFileSync } from 'node:fs'
import knex from 'knex'
import config from '../knexfile.js'

const apply = process.argv.includes('--apply')
const env = process.env.NODE_ENV || 'development'
const db = knex(config[env])
const fixes = JSON.parse(readFileSync(new URL('./venue-corrections.json', import.meta.url)))
const FEATURED = [
  'Noah Kahan – The Great Divide Tour (Night 2)',
  'Macy Gray',
  'Christchurch Big Band Jazz Festival – 20th Anniversary Gala',
  'Iron Maiden',
  'Courtney Barnett',
  'Jack Johnson – Surfilmusic 2026 NZ Tour',
]

try {
  const user = await db('users').where({ name: 'Ciaran Slow' }).first()
  const events = await db('event').where({ created_by: user.id })
  for (const e of events) {
    const key = Object.keys(fixes).find((k) => (e.venue_name || '').startsWith(k))
    if (!key) continue
    const f = fixes[key]
    const description = (e.description || '').split(f.old_address).join(f.address)
    console.log(`${apply ? 'fix' : 'would fix'} #${e.id} ${e.name} -> ${key} (${f.lat}, ${f.lng})`)
    if (apply) await db('event').where({ id: e.id }).update({ address: f.address, lat: f.lat, lng: f.lng, description })
  }
  const feat = events.filter((e) => FEATURED.includes(e.name))
  console.log(`${apply ? 'featuring' : 'would feature'} ${feat.length}: ${feat.map((e) => e.name).join(' | ')}`)
  if (apply) await db('event').whereIn('id', feat.map((e) => e.id)).update({ featured: true })
} finally {
  await db.destroy()
}
