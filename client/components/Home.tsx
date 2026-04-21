import { useState } from "react"
import FilterBar from "./FilterBar"
import FeaturedEvents from "./FeaturedEvents"
import Hero from "./Hero"
import FilteredEvents from "./FilteredEvents"

function Home() {
  const [filter, setFilter] = useState('featured')
  return (
    <main className="bg-[#0a0a0a] min-h-screen">
      <Hero/>
      <FilterBar filter={filter} setFilter={setFilter}/>

      {filter === 'featured' ? <FeaturedEvents /> : <FilteredEvents filter={filter} />}

    </main>
  )
}

export default Home