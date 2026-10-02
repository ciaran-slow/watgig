import { useMemo, useState } from "react"
import { useEvents } from "../hooks/events"
import FilterBar from "./FilterBar"
import FeaturedEvents from "./FeaturedEvents"
import Hero from "./Hero"
import FeaturedCarousel from "./FeaturedCarousel"
import FilteredEvents from "./FilteredEvents"

function Home() {
  const [filter, setFilter] = useState('all')
  const { data: events, isLoading } = useEvents()

  // Upcoming featured events with posters, shuffled once per set of events
  const featuredKey = (events ?? [])
    .filter((e) => e.featured && e.image_url && new Date(e.date) >= new Date(new Date().setHours(0, 0, 0, 0)))
    .map((e) => e.id)
    .join(',')
  const featured = useMemo(() => {
    const ids = featuredKey ? featuredKey.split(',').map(Number) : []
    const list = (events ?? []).filter((e) => ids.includes(e.id))
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[list[i], list[j]] = [list[j], list[i]]
    }
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featuredKey])

  return (
    <main className="bg-[#0a0a0a] min-h-screen min-w-0 w-full">
      {isLoading ? (
        // Same height as the carousel, so nothing flashes or jumps while events load
        <div className="h-[620px] md:h-[780px] w-full bg-[#0a0a0a]" aria-hidden="true" />
      ) : featured.length > 0 ? (
        <FeaturedCarousel events={featured} />
      ) : (
        <Hero />
      )}
      <FilterBar filter={filter} setFilter={setFilter}/>

      {filter === 'featured' ? <FeaturedEvents /> : <FilteredEvents filter={filter} />}

    </main>
  )
}

export default Home