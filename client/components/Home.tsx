import { useMemo, useState } from "react"
import { useEvents } from "../hooks/events"
import FilterBar from "./FilterBar"
import FeaturedEvents from "./FeaturedEvents"
import Hero from "./Hero"
import FilteredEvents from "./FilteredEvents"

function Home() {
  const [filter, setFilter] = useState('all')
  const { data: events } = useEvents()

  // Upcoming featured event posters, shuffled once per set of events
  const posterKey = (events ?? [])
    .filter((e) => e.featured && e.image_url && new Date(e.date) >= new Date(new Date().setHours(0, 0, 0, 0)))
    .map((e) => e.image_url)
    .join('|')
  const slides = useMemo(() => {
    const urls = posterKey ? posterKey.split('|') : []
    for (let i = urls.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[urls[i], urls[j]] = [urls[j], urls[i]]
    }
    return urls
  }, [posterKey])

  return (
    <main className="bg-[#0a0a0a] min-h-screen min-w-0 w-full">
      <Hero slides={slides}/>
      <FilterBar filter={filter} setFilter={setFilter}/>

      {filter === 'featured' ? <FeaturedEvents /> : <FilteredEvents filter={filter} />}

    </main>
  )
}

export default Home