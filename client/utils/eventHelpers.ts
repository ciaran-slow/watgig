import { EventWithId } from "../../models/event"

export function extractCity(address: string | undefined): string {
  if (!address) return 'Unknown'
  const parts = address.split(',')
  const lastPart = parts[parts.length - 1].trim()
  // Remove trailing numbers (postcode)
  return lastPart.replace(/\s+\d+$/, '').trim()
}

export function getUniqueCities(events: EventWithId[] | undefined): string[] {
  if (!events) return []
  const cities = events.map(event => extractCity(event.address))
  return Array.from(new Set(cities)).sort()
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
