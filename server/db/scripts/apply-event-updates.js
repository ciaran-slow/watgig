// Usage: node server/db/scripts/apply-event-updates.js [--apply]
import { readFileSync } from 'node:fs'
import knex from 'knex'
import config from '../knexfile.js'

const apply = process.argv.includes('--apply')
const env = process.env.NODE_ENV || 'development'
const db = knex(config[env])
const patches = JSON.parse(readFileSync(new URL('./nz-events-update.json', import.meta.url)))
const day = (d) => (d instanceof Date ? d.toLocaleDateString('en-CA') : String(d).slice(0, 10))

try {
  const user = await db('users').where({ name: 'Ciaran Slow' }).first()
  const events = await db('event').where({ created_by: user.id })
  for (const { match, set } of patches) {
    const row = events.find((e) => e.name === match[0] && day(e.date) === match[1])
    if (!row) { console.log('NOT FOUND', match.join(' ')); continue }
    console.log(`${apply ? 'update' : 'would update'} #${row.id} ${match[0]}`)
    if (apply) await db('event').where({ id: row.id }).update(set)
  }
} finally {
  await db.destroy()
}
