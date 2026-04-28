import { useRef } from "react"
import { useEvents } from "../hooks/events"
import EventCard from "./EventCard"
import { EventWithId } from "../../models/event"

interface Props {
  currentEventId: number
  genre: string
}

function RelatedEvents({ currentEventId, genre }: Props) {
  const { data: events, isLoading, isError } = useEvents()
  const scrollRef = useRef<HTMLDivElement>(null)

  if (isLoading) return null
  if (isError) return null

  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const related = events
    ?.filter(e => {
      const eventDate = new Date(e.date)
      eventDate.setHours(0, 0, 0, 0)
      return e.id !== currentEventId && 
             e.genre.toLowerCase() === genre.toLowerCase() &&
             eventDate >= now
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  if (!related || related.length === 0) return null

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth 
        : scrollLeft + clientWidth
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-24 border-t border-white/5 mt-12 overflow-hidden">
      <div className="flex justify-between items-end mb-12 px-6 md:px-12">
        <div className="flex flex-col gap-2">
            <h3 className="text-purple-500 font-black text-xs uppercase tracking-[0.3em]">Discovery</h3>
            <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                More {genre} Events
            </h2>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-purple-600 hover:border-purple-600 transition-all active:scale-95 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-purple-600 hover:border-purple-600 transition-all active:scale-95 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar px-6 md:px-12 pb-12"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {related.map((event: EventWithId) => (
          <div key={event.id} className="min-w-[300px] md:min-w-[450px] snap-start">
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default RelatedEvents
