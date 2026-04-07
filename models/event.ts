export interface Event {
  date: string
  name: string
  genre: string
  venue_name: string
  description: string
  artists: string
  start_time: string
  image_url: string
  ticket_link: string
  created_by: string
  featured: boolean
}

// Event type that includes the auto-incremented ID
export interface EventWithId extends Event {
  id: number
}