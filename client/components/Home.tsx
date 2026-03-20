import { useState } from "react"
import FilterBar from "./FilterBar"
import FeaturedEvents from "./FeaturedEvents"
import Hero from "./Hero"

function Home() {
  const [filter, setFilter] = useState('featured')
  return (
    <main>
      <Hero/>
      <FilterBar filter={filter} setFilter={setFilter}/>

      {filter === 'featured' && <FeaturedEvents/>}

    </main>
  )
}

export default Home