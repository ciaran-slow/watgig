import EventCard from "./EventCard"
import { useEvents } from "../hooks/events"
import { useLocationContext } from "./LocationContext"
import { extractCity } from "../utils/eventHelpers"

function FeaturedEvents() {
  const { data: events, isLoading, isError, error } = useEvents()
  const { selectedCity } = useLocationContext()

  if (isLoading) return <p className="p-12">Loading events...</p>
  if (isError) return <p className="p-12 text-red-500">Error loading events: {error.message}</p>

  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const featuredEvents = events
    ?.filter(event => {
      const eventDate = new Date(event.date)
      eventDate.setHours(0, 0, 0, 0)
      
      const cityMatch = selectedCity === 'All Cities' || extractCity(event.address) === selectedCity
      
      return !!event.featured && eventDate >= now && cityMatch
    })
    .sort((a, b) => b.id - a.id) // Sort by ID descending so latest shows first

  return (
    <section className="p-6 md:p-12 w-full overflow-hidden">
      <h2 className="text-4xl md:text-7xl font-black mb-8 md:mb-12 tracking-tighter uppercase leading-none text-white border-l-8 border-purple-600 pl-6 md:pl-8">Featured Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20">
        {featuredEvents?.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
        {featuredEvents?.length === 0 && <p className="col-span-full text-xl italic text-gray-500 text-center">No featured events found.</p>}
      </div>
    </section>
  )
}

export default FeaturedEvents