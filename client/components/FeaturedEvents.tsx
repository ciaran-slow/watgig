import EventCard from "./EventCard"
import { useEvents } from "../hooks/events"

function FeaturedEvents() {
  const { data: events, isLoading, isError, error } = useEvents()

  if (isLoading) return <p className="p-12">Loading events...</p>
  if (isError) return <p className="p-12 text-red-500">Error loading events: {error.message}</p>

  const featuredEvents = events
    ?.filter(event => !!event.featured)
    .sort((a, b) => b.id - a.id) // Sort by ID descending so latest shows first

  return (
    <>
      <section className="p-12">
        <h2 className="text-7xl font-black mb-12 tracking-tighter uppercase leading-none text-white border-l-8 border-purple-600 pl-8">Featured Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
          {featuredEvents?.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
          {featuredEvents?.length === 0 && <p className="col-span-full text-xl italic text-gray-500 text-center">No featured events found.</p>}
        </div>
      </section>
    </>
  )
}

export default FeaturedEvents