export interface Event {
  date: string
  name: string
  genre: string
  venue_name: string
  address?: string
  lat?: number
  lng?: number
  description: string
  artists: string
  start_time: string
  image_url: string
  ticket_link: string
  created_by: number
  featured: boolean
}

export type NewEvent = Omit<Event, 'created_by'>
export type EditableEvent = Partial<Omit<Event, 'created_by'>>

// Event type that includes the auto-incremented ID
export interface EventWithId extends Event {
  id: number
}

export interface DetailedEvent extends EventWithId {
  creator_name?: string
  creator_image?: string
  created_at?: string
}
