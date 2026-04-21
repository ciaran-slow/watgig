import { useParams, useNavigate, Link } from "react-router"
import { useEvent } from "../hooks/events"
import { format, parseISO } from "date-fns"
import Hero from "./Hero"
import eventbg from '../public/eventbg.webp'
import EventMap from "./EventMap"

function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  // @ts-ignore
  const { data: event, isLoading, isError, error } = useEvent(Number(id))

  if (isLoading) return <div className="p-12 text-center text-white">Loading event...</div>
  if (isError) return <div className="p-12 text-center text-red-500">Error: {error.message}</div>
  if (!event) return <div className="p-12 text-center text-white">Event not found.</div>

  const backgroundImage = event.image_url ? `url(${event.image_url})` : `url(${eventbg})`
  const formattedDate = event.date ? format(parseISO(event.date), 'EEEE d MMMM yyyy') : ''
  // @ts-ignore
  const createdAt = event.created_at ? format(parseISO(event.created_at), 'd MMM yyyy') : ''

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Hero 
        title={event.name}
        subtitle={`Live at ${event.venue_name}`}
        tag={event.genre}
        image={event.image_url}
      />
      
      <section className="p-6 md:p-12 max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors font-black text-xs uppercase tracking-[0.2em] mb-8 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Gigs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Image */}
          <div className="relative group rounded-3xl overflow-hidden shadow-2xl border border-white/5 isolate aspect-square lg:aspect-auto lg:h-[600px]">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
              <div className="bg-purple-600 px-4 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-widest shadow-lg">
                {event.genre}
              </div>
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 text-purple-400 font-black text-xs uppercase tracking-[0.3em]">
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  {formattedDate}
                </div>
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  {event.start_time}
                </div>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none mt-2">
                {event.name}
              </h1>
              
              <div className="flex items-center gap-3 text-2xl font-bold text-gray-400 italic">
                <span>Featuring:</span>
                <span className="text-white">{event.artists}</span>
              </div>

              <div className="flex items-center gap-4 mt-6">
                <div className="flex flex-col">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1 text-left">Posted by</p>
                  <Link 
                    to={`/profile/${event.created_by}`}
                    className="text-sm font-bold text-white uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/5 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all"
                  >
                    {/* @ts-ignore */}
                    {event.creator_name || "Unknown"}
                  </Link>
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1 text-left">On</p>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                    {createdAt}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-purple-600 rounded-2xl shadow-inner text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-black text-xs uppercase tracking-widest text-gray-500 mb-1">Venue</p>
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase">{event.venue_name}</h3>
                  <p className="text-sm text-gray-400 font-medium">{event.address}</p>
                </div>
              </div>
              
              {event.venue_name && (event.address || (event.lat && event.lng)) && (
                <EventMap 
                  lat={event.lat} 
                  lng={event.lng} 
                  venueName={event.venue_name} 
                  address={event.address} 
                />
              )}
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-black text-xs uppercase tracking-widest text-purple-400 border-b border-purple-900/30 pb-2">Description</h3>
              <p className="text-xl text-gray-300 leading-relaxed font-medium">
                {event.description}
              </p>
            </div>

            {event.ticket_link && (
              <a 
                href={event.ticket_link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black text-sm uppercase tracking-[0.2em] py-5 rounded-2xl transition duration-300 flex items-center justify-center gap-3 shadow-2xl shadow-purple-900/40 active:scale-[0.98] mt-4"
              >
                Book Tickets Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 100-2H5z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default EventDetails