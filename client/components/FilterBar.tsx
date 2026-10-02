import { useEffect, useRef, useState } from "react"

type Props = {
  filter: string
  setFilter: (value: string) => void
}

function FilterBar({ filter, setFilter }: Props) {
  const [genreOpen, setGenreOpen] = useState(false)
  const stripRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const categories = [
    { id: 'featured', label: 'Featured', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    )},
    { id: 'week', label: 'This Week', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
    { id: 'month', label: 'This Month', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
  ]

  const genres = [
    { id: 'all', label: 'All Genres' },
    { id: 'rock', label: 'Rock / Indie' },
    { id: 'pop', label: 'Pop' },
    { id: 'electronic', label: 'Electronic / DJ' },
    { id: 'hiphop', label: 'Hip-Hop / Rap' },
    { id: 'acoustic', label: 'Acoustic' },
    { id: 'jazz', label: 'Jazz / Blues' },
    { id: 'metal', label: 'Metal / Punk' },
    { id: 'other', label: 'Other' },
  ]

  const timeOptions = [
    { id: 'all', label: 'All' },
    { id: 'featured', label: 'Featured' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ]

  const activeGenre = genres.find((g) => g.id === filter && g.id !== 'all')

  const getButtonClass = (value: string) =>
    `flex items-center gap-2 py-2.5 px-5 rounded-full text-sm font-bold transition-all duration-300 border-2 active:scale-95 whitespace-nowrap ${
      filter === value 
        ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-900/40' 
        : 'bg-white/5 border-white/5 text-gray-400 hover:border-purple-500/50 hover:text-white hover:bg-white/10'
    }`

  // Keep the active chip visible in the mobile row
  useEffect(() => {
    const active = stripRef.current?.querySelector<HTMLElement>('[aria-pressed="true"]')
    active?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [filter])

  // Close the genre popover on outside click, Escape or scroll
  useEffect(() => {
    if (!genreOpen) return
    const close = () => setGenreOpen(false)
    const onDown = (e: MouseEvent) => {
      if (!popoverRef.current?.contains(e.target as Node)) close()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', close, { passive: true })
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', close)
    }
  }, [genreOpen])

  return (
    <div className="bg-[#0a0a0a] sticky top-[60px] md:top-[104px] z-40">
      {/* Mobile: one compact, swipeable row that never changes height */}
      <div ref={stripRef} className="md:hidden flex gap-2 overflow-x-auto no-scrollbar px-4 py-3 w-full max-w-full min-w-0">
        {[{ ...genres[0], icon: null }, ...categories, ...genres.slice(1).map((g) => ({ ...g, icon: null }))].map((item) => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            aria-pressed={filter === item.id}
            className={`${getButtonClass(item.id)} !py-2 !px-4 shrink-0`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* Soft fade instead of a hard bottom edge */}
      <div className="absolute inset-x-0 top-full h-6 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none" />

      {/* Desktop: one toolbar row. Time on the left, genre popover on the right. */}
      <div className="hidden md:flex max-w-screen-2xl mx-auto px-12 py-4 items-center justify-between gap-6">
        <div role="group" aria-label="When" className="flex items-center gap-1 bg-white/5 rounded-full p-1">
          {timeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              aria-pressed={filter === opt.id}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
                filter === opt.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div ref={popoverRef} className="relative flex items-center gap-3">
          {activeGenre && (
            <button
              onClick={() => setFilter('all')}
              className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setGenreOpen((o) => !o)}
            aria-expanded={genreOpen}
            aria-haspopup="true"
            className={`flex items-center gap-2 pl-5 pr-4 py-2.5 rounded-full text-sm font-bold border-2 transition-colors ${
              activeGenre
                ? 'bg-purple-600 border-purple-600 text-white'
                : 'bg-white/5 border-white/5 text-gray-300 hover:border-purple-500/50 hover:text-white'
            }`}
          >
            {activeGenre ? activeGenre.label : 'Genre'}
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${genreOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Always mounted so it can animate in and out (also when scroll closes it) */}
          <div
            aria-hidden={!genreOpen}
            className={`absolute right-0 top-full mt-3 w-[26rem] bg-[#141414] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 p-4 z-50 origin-top-right transition-[opacity,transform,visibility] duration-300 ease-out ${
              genreOpen
                ? 'opacity-100 visible translate-y-0 scale-100'
                : 'opacity-0 invisible -translate-y-2 scale-95 pointer-events-none'
            }`}
          >
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-500 mb-3">Music genre</p>
              <div className="grid grid-cols-2 gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => {
                      setFilter(genre.id)
                      setGenreOpen(false)
                    }}
                    aria-pressed={filter === genre.id}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                      filter === genre.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {genre.label}
                  </button>
                ))}
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterBar
