import EventCard from "./EventCard"
import { getHeaderForFilter } from "../utils/eventHelpers"
import { useEvents } from "../hooks/events"

type Props = {
  filter: string
}

function FilteredEvents({ filter }: Props) {
  const { data: events, isLoading, isError, error } = useEvents()
  const header = getHeaderForFilter(filter)

  if (isLoading) return <p className="p-12">Loading events...</p>
  if (isError) return <p className="p-12 text-red-500">Error loading events: {error.message}</p>

  // Use the actual current date
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  
  const filteredEvents = events
    ?.filter(event => {
      const eventDate = new Date(event.date)
      
      switch (filter) {
        case 'week': {
          const diffTime = eventDate.getTime() - now.getTime()
          const diffDays = diffTime / (1000 * 60 * 60 * 24)
          return diffDays >= 0 && diffDays <= 7
        }
        case 'month': {
          return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear()
        }
        case 'rock':
        case 'pop':
        case 'electronic':
        case 'hiphop':
        case 'acoustic':
        case 'jazz':
        case 'metal':
        case 'other':
          return event.genre?.toLowerCase() === filter.toLowerCase()
        case 'all':
          return true
        default:
          return true
      }
    })
    .sort((a, b) => b.id - a.id) // Sort by ID descending so latest shows first

  return (
      <section className="p-12">
        <h2 className="text-7xl font-black mb-12 tracking-tighter uppercase leading-none text-white border-l-8 border-purple-600 pl-8">{header}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
          {filteredEvents?.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
          {filteredEvents?.length === 0 && <p className="col-span-full text-xl italic text-gray-500 text-center">No events found for this filter.</p>}
        </div>
      </section>
  )
}

export default FilteredEvents