import { useState } from "react"

type Props = {
  filter: string
  setFilter: (value: string) => void
}

function FilterBar({ filter, setFilter }: Props) {
  const [isOpen, setIsOpen] = useState(false)

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

  const getButtonClass = (value: string) =>
    `flex items-center gap-2 py-2.5 px-5 rounded-full text-sm font-bold transition-all duration-300 border-2 active:scale-95 whitespace-nowrap ${
      filter === value 
        ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-900/40' 
        : 'bg-white/5 border-white/5 text-gray-400 hover:border-purple-500/50 hover:text-white hover:bg-white/10'
    }`

  const handleFilterClick = (value: string) => {
    setFilter(value)
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }

  return (
    <div className="bg-black/60 backdrop-blur-xl sticky top-0 z-40 border-b border-white/5">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-6">
        <div className="flex flex-col gap-6">
          {/* Mobile Header */}
          <div className="flex justify-between items-center md:hidden">
            <h2 className="font-black text-2xl tracking-tight text-white uppercase">Filters</h2>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 bg-white/5 rounded-lg text-gray-400"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-6 w-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Filters Content */}
          <div className={`
            flex-col gap-8
            ${isOpen ? 'flex' : 'hidden'} 
            md:flex md:items-center
          `}>
            
            {/* Top Row: Time & Status */}
            <div className="flex flex-col items-center gap-3">
              <h2 className="font-black text-[9px] md:text-xs tracking-[0.3em] text-gray-500 uppercase">Time & Status</h2>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => handleFilterClick(cat.id)} 
                    className={getButtonClass(cat.id)}
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Row: Music Genres */}
            <div className="flex flex-col items-center gap-3 w-full">
              <h2 className="font-black text-[9px] md:text-xs tracking-[0.3em] text-gray-500 uppercase">Music Genres</h2>
              <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
                {genres.map((genre) => (
                  <button 
                    key={genre.id}
                    onClick={() => handleFilterClick(genre.id)} 
                    className={getButtonClass(genre.id)}
                  >
                    {genre.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterBar