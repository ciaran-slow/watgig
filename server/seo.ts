// Share previews (Open Graph / Twitter cards). Crawlers don't run JavaScript, so the
// server writes the right tags into index.html for each page it serves.
import { readFile } from 'node:fs/promises'
import * as Path from 'node:path'

const SITE_NAME = 'WatGig'
const DEFAULT_TITLE = 'WatGig – Find your next gig'
const DEFAULT_DESCRIPTION =
  'Discover live music across New Zealand, from arena tours to small-town pub gigs. Find, save and share your next gig on WatGig.'

export interface SeoEvent {
  id: number
  name: string
  date: string | Date
  artists?: string | null
  venue_name?: string | null
  description?: string | null
  image_url?: string | null
}

interface SeoPage {
  title: string
  description: string
  url: string
  image: string
  type: 'website' | 'article'
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// 1200x630 JPG crop for Cloudinary images; other hosts are used as they are
export function socialImage(url: string | null | undefined, origin: string): string {
  if (!url) return `${origin}/og-default.png`
  const cloudinary = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?!.*\bw_\d+)/
  if (cloudinary.test(url)) return url.replace(cloudinary, '$1c_fill,g_auto,w_1200,h_630,f_jpg,q_auto/')
  return url
}

function dayOf(date: string | Date): string {
  return date instanceof Date ? date.toISOString().slice(0, 10) : String(date).slice(0, 10)
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// Built by hand so the output doesn't depend on the server's ICU/locale data
function formatDate(date: string | Date): string {
  const d = new Date(`${dayOf(date)}T12:00:00Z`)
  return `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

function firstParagraph(text: string | null | undefined, max = 160): string {
  const first = (text ?? '').split(/\n\s*\n/)[0].replace(/\s+/g, ' ').trim()
  return first.length > max ? `${first.slice(0, max - 1).trimEnd()}…` : first
}

export function pageForEvent(event: SeoEvent, origin: string): SeoPage {
  const when = formatDate(event.date)
  const where = event.venue_name ? ` at ${event.venue_name}` : ''
  const intro = `${when}${where}.`
  const detail = firstParagraph(event.description)
  return {
    title: `${event.name} | ${SITE_NAME}`,
    description: detail ? `${intro} ${detail}` : intro,
    url: `${origin}/event/${event.id}`,
    image: socialImage(event.image_url, origin),
    type: 'article',
  }
}

export function defaultPage(origin: string, path = '/'): SeoPage {
  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: `${origin}${path === '/' ? '' : path}`,
    image: `${origin}/og-default.png`,
    type: 'website',
  }
}

export function renderTags(page: SeoPage): string {
  const t = escapeHtml(page.title)
  const d = escapeHtml(page.description)
  const u = escapeHtml(page.url)
  const i = escapeHtml(page.image)
  return [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<link rel="canonical" href="${u}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:type" content="${page.type}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:url" content="${u}" />`,
    `<meta property="og:image" content="${i}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:locale" content="en_NZ" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${i}" />`,
  ].join('\n    ')
}

const BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/

export function injectSeo(html: string, page: SeoPage): string {
  const block = `<!-- seo:start -->\n    ${renderTags(page)}\n    <!-- seo:end -->`
  return BLOCK.test(html) ? html.replace(BLOCK, () => block) : html
}

let template: string | undefined
export async function renderIndex(page: SeoPage): Promise<string> {
  template ??= await readFile(Path.resolve('./dist/index.html'), 'utf8')
  return injectSeo(template, page)
}
