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
  const moved = useRef(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const frame = useRef(0)
  const drag = useRef<{
    x: number
    y: number
    lastX: number
    lastT: number
    v: number
    locked: boolean
  } | null>(null)
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

  // Position the track straight on the DOM while dragging, so a swipe never waits on a React render
  const setTrack = (dx: number, animate: boolean, index: number) => {
    const el = trackRef.current
    if (!el) return
    el.style.transition = animate ? '' : 'none'
    el.style.transform = `translate3d(calc(${-index * 100}% + ${dx}px), 0, 0)`
  }

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, a')) return
    drag.current = { x: e.clientX, y: e.clientY, lastX: e.clientX, lastT: performance.now(), v: 0, locked: false }
    moved.current = false
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y

    if (!d.locked) {
      // Wait to see which way the gesture goes: sideways drags the slides, vertical is left to the page
      if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        d.locked = true
        moved.current = true
        setPaused(true)
        sectionRef.current?.setAttribute('data-dragging', 'true')
        ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      } else if (Math.abs(dy) > 8) {
        drag.current = null
      }
      return
    }

    const now = performance.now()
    const dt = now - d.lastT
    if (dt > 0) d.v = 0.8 * d.v + 0.2 * ((e.clientX - d.lastX) / dt) // smoothed px/ms
    d.lastX = e.clientX
    d.lastT = now

    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => setTrack(dx, false, active))
  }

  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current
    drag.current = null
    if (!d || !d.locked) return
    cancelAnimationFrame(frame.current)
    sectionRef.current?.removeAttribute('data-dragging')

    const dx = e.clientX - d.x
    const width = trackRef.current?.offsetWidth ?? 1
    const flicked = Math.abs(d.v) > 0.35 && Math.abs(dx) > 20
    const commit = Math.abs(dx) > width * 0.2 || flicked
    const target = commit ? (active + (dx < 0 ? 1 : -1) + count) % count : active

    setTrack(0, true, target) // ease from where the finger let go
    setActive(target)
    setPaused(false)
    setTimeout(() => (moved.current = false), 60) // swallow the click that ends a drag
  }

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Featured events"
      className="relative w-full h-[max(700px,85svh)] md:h-[780px] overflow-hidden bg-[#0a0a0a] select-none group"
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
        className="flex h-full will-change-transform transition-transform duration-slow ease-smooth"
        style={{ transform: `translate3d(${-active * 100}%, 0, 0)` }}
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
                  isActive ? 'opacity-100 translate-y-0 delay-150' : 'opacity-0 translate-y-4 group-data-[dragging=true]:opacity-100 group-data-[dragging=true]:translate-y-0 group-data-[dragging=true]:delay-0'
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
