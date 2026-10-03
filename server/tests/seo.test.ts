import { describe, it, expect } from 'vitest'
import { defaultPage, escapeHtml, injectSeo, pageForEvent, renderTags, socialImage } from '../seo.ts'

const origin = 'https://watgig.example'
const event = {
  id: 6,
  name: 'Lily Allen "West End Girl"',
  date: new Date('2026-10-21T00:00:00.000Z'),
  artists: 'Lily Allen',
  venue_name: 'Spark Arena, Auckland',
  description: 'First paragraph about the show & more.\n\nSecond paragraph.',
  image_url: 'https://res.cloudinary.com/demo/image/upload/v1/watgig/events/lily.jpg',
}

describe('share previews', () => {
  it('builds event tags from the event', () => {
    const page = pageForEvent(event, origin)
    expect(page.title).toBe('Lily Allen "West End Girl" | WatGig')
    expect(page.description).toContain('Wednesday 21 October 2026 at Spark Arena, Auckland.')
    expect(page.description).toContain('First paragraph about the show & more.')
    expect(page.description).not.toContain('Second paragraph')
    expect(page.url).toBe('https://watgig.example/event/6')
    expect(page.image).toContain('c_fill,g_auto,w_1200,h_630,f_jpg')
  })

  it('escapes HTML in titles and descriptions', () => {
    const tags = renderTags(pageForEvent({ ...event, name: '<script>alert(1)</script>' }, origin))
    expect(tags).not.toContain('<script>')
    expect(tags).toContain('&lt;script&gt;')
    expect(escapeHtml(`"'&<>`)).toBe('&quot;&#39;&amp;&lt;&gt;')
  })

  it('falls back to the default image when an event has none', () => {
    expect(socialImage(null, origin)).toBe('https://watgig.example/og-default.png')
    expect(socialImage('https://example.com/a.jpg', origin)).toBe('https://example.com/a.jpg')
  })

  it('swaps the tag block in index.html', () => {
    const html = '<head><!-- seo:start --><title>old</title><!-- seo:end --></head>'
    const out = injectSeo(html, defaultPage(origin))
    expect(out).not.toContain('<title>old</title>')
    expect(out).toContain('og:image" content="https://watgig.example/og-default.png"')
    expect(out).toContain('twitter:card" content="summary_large_image"')
  })
})
