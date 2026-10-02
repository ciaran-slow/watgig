// Usage: node server/db/scripts/post-nz-events.js [--apply]
// Without --apply this is a dry run. Set NODE_ENV=production and DATABASE_URL to target Neon.
import { readFileSync } from 'node:fs'
import knex from 'knex'
import config from '../knexfile.js'

const apply = process.argv.includes('--apply')
const env = process.env.NODE_ENV || 'development'
const db = knex(config[env])
const events = JSON.parse(readFileSync(new URL('./nz-events.json', import.meta.url)))

try {
  const user = await db('users').where({ name: 'Ciaran Slow' }).first()
  if (!user) throw new Error('No user named "Ciaran Slow" found in this database')
  const existing = await db('event').where({ created_by: user.id }).select('name', 'date')
  const seen = new Set(existing.map((e) => `${e.name}|${e.date instanceof Date ? e.date.toLocaleDateString('en-CA') : String(e.date).slice(0, 10)}`))
  const rows = events
    .filter((e) => !seen.has(`${e.name}|${e.date}`))
    .map((e) => ({ ...e, created_by: user.id, featured: false }))
  console.log(`${env}: user #${user.id}, ${rows.length} new of ${events.length} events`)
  if (apply && rows.length) await db('event').insert(rows)
  console.log(apply ? 'Inserted.' : 'Dry run only. Re-run with --apply to insert.')
} finally {
  await db.destroy()
}
