import { useRef, useState, useEffect } from "react"
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
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 10)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
    }
  }

  useEffect(() => {
    const current = scrollRef.current
    if (current) {
      current.addEventListener('scroll', checkScroll)
      checkScroll()
      const timer = setTimeout(checkScroll, 100)
      window.addEventListener('resize', checkScroll)
      
      return () => {
        current.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
        clearTimeout(timer)
      }
    }
  }, [events])

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
    <section className="py-24 border-t border-white/5 mt-12 overflow-hidden relative group">
      <div className="mb-12 px-6 md:px-12">
        <div className="flex flex-col gap-2">
            <h3 className="text-purple-500 font-black text-xs uppercase tracking-[0.3em]">Discovery</h3>
            <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                More {genre} Events
            </h2>
        </div>
      </div>

      <div className="relative px-6 md:px-12">
        {/* Navigation Buttons */}
        <button 
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={`absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 p-3 md:p-4 rounded-full bg-purple-600 border border-purple-500/50 text-white transition-all active:scale-95 opacity-100 md:opacity-0 md:group-hover:opacity-100 disabled:opacity-20 disabled:cursor-not-allowed block backdrop-blur-sm shadow-lg shadow-purple-900/20`}
          aria-label="Previous events"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button 
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={`absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 p-3 md:p-4 rounded-full bg-purple-600 border border-purple-500/50 text-white transition-all active:scale-95 opacity-100 md:opacity-0 md:group-hover:opacity-100 disabled:opacity-20 disabled:cursor-not-allowed block backdrop-blur-sm shadow-lg shadow-purple-900/20`}
          aria-label="Next events"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-12"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {related.map((event: EventWithId) => (
            <div key={event.id} className="min-w-full md:min-w-[calc((100%-1*2rem)/2)] lg:min-w-[calc((100%-2*2rem)/3)] snap-start">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RelatedEvents
