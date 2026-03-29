import EventCard from "./EventCard"
import { getHeaderForFilter } from "../utils/eventHelpers"

type Props = {
  filter: string
}

function FilteredEvents({ filter }: Props) {
  const header = getHeaderForFilter(filter)

  return (
      <section className="p-12">
        <h2 className="text-6xl font-bold mb-6">{header}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
          <EventCard/>
          <EventCard/>
          <EventCard/>
          <EventCard/>
          <EventCard/>
          <EventCard/>
        </div>
      </section>
  )
}

export default FilteredEvents