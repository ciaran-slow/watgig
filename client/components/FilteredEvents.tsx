import EventCard from "./EventCard"

type Props = {
  filter: string
}

function FilteredEvents({ filter }: Props) {
  let header

  switch (filter) {
    case 'featured':
      header = 'Featured Events'
      break
    case 'week':
      header = 'This Week'
      break
    case 'month':
      header = 'This Month'
      break
    case 'rock':
      header = 'Rock / Indie'
      break
    case 'pop':
      header = 'Pop'
      break
    case 'electronic':
      header = 'Electronic / DJ'
      break
    case 'hiphop':
      header = 'Hip-Hop / Rap'
      break
    case 'acoustic':
      header = 'Acoustic'
      break
    case 'jazz':
      header = 'Jazz / Blues'
      break
    case 'metal':
      header = 'Metal / Punk'
      break
    default:
      header = 'All Events'
  }

  return (
      <section className="p-12 pt-0">
        <h2 className="text-6xl font-bold mb-6">{header}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
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