import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { format, parseISO } from 'date-fns'
import { EventWithId } from '../../models/event'
import herobg from '../public/hero.webp'
import { optimisedImage, imageSrcSet } from '../utils/image'

interface Props {
  events: EventWithId[]
}

const SLIDE_MS = 7000

function FeaturedCarousel({ events }: Props) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startX = useRef<number | null>(null)
  const moved = useRef(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const count = events.length
  // Only fetch slide images once they're current, next, or already seen
  const [loaded, setLoaded] = useState<Set<number>>(new Set())
  const [seen, setSeen] = useState<Set<number>>(new Set([0]))

  const go = (index: number) => setActive((index + count) % count)

  // Auto-advance, unless paused or the user prefers reduced motion
  useEffect(() => {
    setActive(0)
    setSeen(new Set([0]))
  }, [count])

  useEffect(() => {
    setSeen((prev) => {
      const next = new Set(prev)
      next.add(active)
      return next
    })
  }, [active])

  useEffect(() => {
    if (count < 2 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setActive((i) => (i + 1) % count), SLIDE_MS)
    return () => clearInterval(timer)
  }, [count, paused, active])

  // Drag/swipe with the finger or mouse; the slides follow the pointer
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, a')) return
    startX.current = e.clientX
    moved.current = false
    setDragging(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    if (Math.abs(dx) > 6) moved.current = true
    setDragX(dx)
  }
  const endDrag = (e: React.PointerEvent) => {
    if (startX.current === null) return
    const width = trackRef.current?.offsetWidth ?? 1
    const dx = e.clientX - startX.current
    startX.current = null
    setDragging(false)
    setDragX(0)
    if (Math.abs(dx) > Math.min(80, width * 0.15)) go(active + (dx < 0 ? 1 : -1))
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured events"
      className="relative w-full h-[max(700px,85svh)] md:h-[780px] overflow-hidden bg-[#0a0a0a] select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={{ touchAction: 'pan-y' }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(active + 1)
        if (e.key === 'ArrowLeft') go(active - 1)
      }}
    >
      <div
        ref={trackRef}
        className={`flex h-full ${dragging ? '' : 'transition-transform duration-slow ease-smooth'}`}
        style={{ transform: `translateX(calc(${-active * 100}% + ${dragX}px))` }}
      >
      {events.map((event, i) => {
        const isActive = i === active
        return (
          <div
            key={event.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}: ${event.name}`}
            aria-hidden={!isActive}
            className="relative h-full w-full shrink-0"
            onClickCapture={(e) => {
              if (moved.current) {
                e.preventDefault()
                e.stopPropagation()
                moved.current = false
              }
            }}
          >
            {(seen.has(i) || i === (active + 1) % count || i === (active - 1 + count) % count) && (
            <img
              src={optimisedImage(event.image_url, 1280) ?? event.image_url ?? herobg}
              srcSet={imageSrcSet(event.image_url, [640, 1024, 1600])}
              sizes="100vw"
              alt=""
              width={1600}
              height={900}
              fetchPriority={i === 0 ? 'high' : 'auto'}
              decoding="async"
              draggable={false}
              onLoad={() => setLoaded((prev) => new Set(prev).add(i))}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-long ${
                loaded.has(i) ? 'opacity-100' : 'opacity-0'
              }`}
            />
            )}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(to bottom, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.15) 30%, rgba(10,10,10,0.55) 60%, #0a0a0a 100%)',
              }}
            />

            <div className="absolute inset-0 hidden md:block bg-gradient-to-l from-black/60 via-black/20 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 px-4 md:px-24 pb-16 md:pb-20 max-w-screen-2xl mx-auto left-0 right-0 flex justify-end">
              <div
                className={`flex flex-col items-end text-right gap-3 md:gap-4 max-w-3xl transition-[opacity,transform] duration-long ease-smooth ${
                  isActive ? 'opacity-100 translate-y-0 delay-150' : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <span className="bg-purple-600 px-3 py-1 rounded-full text-[11px] font-bold text-white uppercase tracking-wider">
                    Featured
                  </span>
                  {event.genre && (
                    <span className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[11px] font-bold text-white uppercase tracking-wider">
                      {event.genre}
                    </span>
                  )}
                </div>

                <h2 className="text-3xl md:text-6xl font-black text-white uppercase leading-[1.05] tracking-tight line-clamp-3 break-words">
                  {event.name}
                </h2>

                {event.artists && event.artists !== event.name && (
                  <p className="text-sm md:text-lg italic text-gray-200 line-clamp-1">{event.artists}</p>
                )}

                <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-sm md:text-base font-semibold text-white/90">
                  <span className="text-purple-300">
                    {event.date ? format(parseISO(event.date), 'EEE d MMM') : ''}
                    {event.start_time ? ` · ${event.start_time}` : ''}
                  </span>
                  <span className="line-clamp-1">{event.venue_name}</span>
                </div>

                <div className="mt-1">
                  <Link
                    to={`/event/${event.id}`}
                    tabIndex={isActive ? 0 : -1}
                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-purple-900/30 active:scale-[0.97]"
                  >
                    See event
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )
      })}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous event"
            onClick={() => go(active - 1)}
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white backdrop-blur-md transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            type="button"
            aria-label="Next event"
            onClick={() => go(active + 1)}
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white backdrop-blur-md transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2">
            {events.map((event, i) => (
              <button
                key={event.id}
                type="button"
                aria-label={`Go to ${event.name}`}
                aria-current={i === active}
                onClick={() => go(i)}
                className={`h-2 rounded-full transition-all duration-base ${
                  i === active ? 'w-8 bg-purple-500' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default FeaturedCarousel
