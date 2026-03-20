function EventCard() {
  return (
    <div 
      className="relative p-6 rounded-xl h-[400px] shadow-slate-700 shadow-md border-4 text-white hover:scale-105 hover:border-4 hover:border-purple-500 transition ease-in-out cursor-pointer"
      style={{backgroundImage: "url('https://picsum.photos/400/400')", backgroundSize: "cover", backgroundPosition: 'center'}}
    >
      <div className="absolute top-6 right-6 bg-purple-500 p-2 rounded-xl">
        <p>Featured</p>
      </div>
      <div className="absolute bottom-6 left-6 p-4 rounded-xl bg-black">
        <h2 className="text-xl font-bold">March 20</h2>
        <h2 className="text-4xl font-bold">Event Name</h2>
        <h3 className="text-xl font-bold">Featuring:</h3>
        <h3>Artist1, artist2, artist3 artist4</h3>
      </div>
    </div>
  )
}

export default EventCard