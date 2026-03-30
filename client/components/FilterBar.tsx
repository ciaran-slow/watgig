import { useState } from "react"

type Props = {
  filter: string
  setFilter: (value: string) => void
}

function FilterBar({ filter, setFilter }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const getButtonClass = (value: string) =>
    `py-2 px-4 rounded-xl text-white hover:bg-purple-800 transition focus:outline-none focus:ring-4 focus:ring-purple-500 ${
      filter === value ? 'bg-purple-800' : 'bg-black'
    }`

  const handleFilterClick = (value: string) => {
    setFilter(value)
    setIsOpen(false) // 👈 closes on mobile
  }

  return (
    <>
      {/* Header */}
      <div className="px-12 pt-6 mb-3 flex justify-between items-center">
        <h2 className="font-bold text-2xl">Filters</h2>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
        >
          <span
            className={`inline-block transform transition-transform duration-300 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
          >
            ▼
          </span>
        </button>
      </div>

      {/* Filters */}
      <div
        className={`
          px-12 pb-6 flex flex-wrap gap-2 border-b-2
          ${isOpen ? 'flex' : 'hidden'} 
          md:flex
        `}
      >
        <button onClick={() => handleFilterClick('featured')} className={getButtonClass('featured')}>
          Featured Events
        </button>

        <button onClick={() => handleFilterClick('week')} className={getButtonClass('week')}>
          This Week
        </button>

        <button onClick={() => handleFilterClick('month')} className={getButtonClass('month')}>
          This Month
        </button>

        <button onClick={() => handleFilterClick('rock')} className={getButtonClass('rock')}>
          Rock / Indie
        </button>

        <button onClick={() => handleFilterClick('pop')} className={getButtonClass('pop')}>
          Pop
        </button>

        <button onClick={() => handleFilterClick('electronic')} className={getButtonClass('electronic')}>
          Electronic / DJ
        </button>

        <button onClick={() => handleFilterClick('hiphop')} className={getButtonClass('hiphop')}>
          Hip-Hop / Rap
        </button>

        <button onClick={() => handleFilterClick('acoustic')} className={getButtonClass('acoustic')}>
          Acoustic
        </button>

        <button onClick={() => handleFilterClick('jazz')} className={getButtonClass('jazz')}>
          Jazz / Blues
        </button>

        <button onClick={() => handleFilterClick('metal')} className={getButtonClass('metal')}>
          Metal / Punk
        </button>
      </div>
    </>
  )
}

export default FilterBar