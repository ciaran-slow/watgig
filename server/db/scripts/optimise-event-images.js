// Re-host event posters on Cloudinary so the client can request resized WebP/AVIF versions.
// Usage: node server/db/scripts/optimise-event-images.js [--apply]
// Reads VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET from the environment or .env.
import { readFileSync } from 'node:fs'
import knex from 'knex'
import config from '../knexfile.js'

function loadEnv() {
  try {
    for (const line of readFileSync(new URL('../../../.env', import.meta.url), 'utf8').split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch { /* no .env */ }
}
loadEnv()

const cloud = process.env.VITE_CLOUDINARY_CLOUD_NAME
const preset = process.env.VITE_CLOUDINARY_UPLOAD_PRESET
if (!cloud || !preset) throw new Error('Cloudinary cloud name / upload preset not configured')

async function post(file) {
  const body = new FormData()
  body.set('file', file)
  body.set('upload_preset', preset)
  body.set('folder', 'watgig/events')
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body })
  const data = await res.json()
  if (!res.ok || !data.secure_url) throw new Error(data.error?.message || `upload failed (${res.status})`)
  return data.secure_url
}

// Cloudinary fetches the URL itself; some sites block that (403), so fall back to downloading it here
export async function uploadToCloudinary(url) {
  try {
    return await post(url)
  } catch (firstError) {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const type = res.headers.get('content-type') || ''
    if (!res.ok || !type.startsWith('image/')) throw firstError
    return post(new Blob([await res.arrayBuffer()], { type }))
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const apply = process.argv.includes('--apply')
  const db = knex(config[process.env.NODE_ENV || 'development'])
  try {
    const events = await db('event').whereNotNull('image_url').select('id', 'name', 'image_url')
    const cache = new Map()
    let done = 0
    for (const e of events) {
      if (/^https:\/\/res\.cloudinary\.com\//.test(e.image_url)) continue
      console.log(`${apply ? 'upload' : 'would upload'} #${e.id} ${e.name}`)
      if (!apply) continue
      try {
        if (!cache.has(e.image_url)) cache.set(e.image_url, await uploadToCloudinary(e.image_url))
        await db('event').where({ id: e.id }).update({ image_url: cache.get(e.image_url) })
        done++
      } catch (err) {
        console.log(`  FAILED #${e.id}: ${err.message}`)
      }
    }
    console.log(apply ? `Re-hosted ${done} images` : 'Dry run only')
  } finally {
    await db.destroy()
  }
}
