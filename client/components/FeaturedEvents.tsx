import EventCard from "./EventCard"

function FeaturedEvents() {
  return (
    <>
      {/* Featured events */}
      <section className="p-12">
        <h2 className="text-6xl font-bold mb-6">Featured Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
          <EventCard/>
          <EventCard/>
          <EventCard/>
          <EventCard/>
          <EventCard/>
          <EventCard/>
        </div>
      </section>
    </>
  )
}

export default FeaturedEvents