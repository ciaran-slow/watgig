type Props = {
  filter: string
  setFilter: (value: string) => void
}

function FilterBar({ filter, setFilter }: Props) {
  const getButtonClass = (value: string) =>
    `py-2 px-4 rounded-xl text-white ${
      filter === value ? 'bg-purple-500' : 'bg-black'
    }`

  return (
    <div className="p-12 flex flex-wrap gap-2">
      <button 
        onClick={() => setFilter('featured')}
        className={getButtonClass('featured')}
      >
        Featured Events
      </button>

      <button 
        onClick={() => setFilter('week')}
        className={getButtonClass('week')}
      >
        This Week
      </button>

      <button 
        onClick={() => setFilter('month')}
        className={getButtonClass('month')}
      >
        This Month
      </button>

      <button 
        onClick={() => setFilter('rock')}
        className={getButtonClass('rock')}
      >
        Rock / Indie
      </button>

      <button 
        onClick={() => setFilter('pop')}
        className={getButtonClass('pop')}
      >
        Pop
      </button>

      <button 
        onClick={() => setFilter('electronic')}
        className={getButtonClass('electronic')}
      >
        Electronic / DJ
      </button>

      <button 
        onClick={() => setFilter('hiphop')}
        className={getButtonClass('hiphop')}
      >
        Hip-Hop / Rap
      </button>

      <button 
        onClick={() => setFilter('acoustic')}
        className={getButtonClass('acoustic')}
      >
        Acoustic
      </button>

      <button 
        onClick={() => setFilter('jazz')}
        className={getButtonClass('jazz')}
      >
        Jazz Blues
      </button>

      <button 
        onClick={() => setFilter('metal')}
        className={getButtonClass('metal')}
      >
        Metal / Punk
      </button>  
    </div>
  )
}

export default FilterBar