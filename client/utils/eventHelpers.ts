import { EventWithId } from "../../models/event"

export function extractCity(address: string | undefined): string {
  if (!address) return ''
  const parts = address.split(',').map((p) => p.trim())
  if (parts.length === 0) return ''

  // Common country/state names to ignore if they are the last part
  const toIgnore = [
    'nz',
    'new zealand',
    'australia',
    'au',
    'new south wales',
    'vic',
    'qld',
    'wa',
    'sa',
    'tas',
    'act',
    'nt',
  ]

  let cityCandidate = parts[parts.length - 1]

  // If the last part is something we ignore, look at the previous part
  if (toIgnore.includes(cityCandidate.toLowerCase()) && parts.length > 1) {
    cityCandidate = parts[parts.length - 2]
  }

  // Remove postcode (digits at the end) and trim
  const city = cityCandidate
    .replace(/\s+\d+$/, '')
    .replace(/\d+$/, '')
    .trim()

  if (city.length === 0) return ''

  // Normalize to Title Case to prevent duplicates from case differences
  return city
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export function getUniqueCities(events: EventWithId[] | undefined): string[] {
  if (!events) return []
  const citySet = new Set<string>()

  events.forEach((event) => {
    const city = extractCity(event.address)
    if (city && city !== '' && city !== 'Unknown') {
      citySet.add(city)
    }
  })

  return Array.from(citySet).sort()
}

export function getHeaderForFilter(filter: string): string {
  switch (filter) {
    case 'featured':
      return 'Featured Events'
    case 'week':
      return 'This Week'
    case 'month':
      return 'This Month'
    case 'rock':
      return 'Rock / Indie'
    case 'pop':
      return 'Pop'
    case 'electronic':
      return 'Electronic / DJ'
    case 'hiphop':
      return 'Hip-Hop / Rap'
    case 'acoustic':
      return 'Acoustic'
    case 'jazz':
      return 'Jazz / Blues'
    case 'metal':
      return 'Metal / Punk'
    case 'other':
      return 'Other'
    default:
      return 'All Events'
  }
}
