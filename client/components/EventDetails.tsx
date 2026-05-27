import { useParams, useNavigate, Link } from "react-router"
import { useEvent } from "../hooks/events"
import { format, parseISO } from "date-fns"
import toast from "react-hot-toast"
import Hero from "./Hero"
import eventbg from '../public/eventbg.webp'
import EventMap from "./EventMap"
import RelatedEvents from "./RelatedEvents"

function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: event, isLoading, isError, error } = useEvent(Number(id))

  if (isLoading) return <div className="p-12 text-center text-white">Loading event...</div>
  if (isError) return <div className="p-12 text-center text-red-500">Error: {(error as Error).message}</div>
  if (!event) return <div className="p-12 text-center text-white">Event not found.</div>

  const backgroundImage = event.image_url ? `url(${event.image_url})` : `url(${eventbg})`
  const formattedDate = event.date ? format(parseISO(event.date), 'EEEE d MMMM yyyy') : ''
  const isHistorical = event.date ? new Date(event.date) < new Date(new Date().setHours(0, 0, 0, 0)) : false
  const createdAt = event.created_at ? format(parseISO(event.created_at), 'd MMM yyyy') : ''

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Hero 
        title={event.name}
        subtitle={`Live at ${event.venue_name}`}
        tag={isHistorical ? `${event.genre} (HISTORICAL)` : event.genre}
        image={event.image_url}
      />
      
      <section className="p-12 max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors font-black text-xs uppercase tracking-[0.2em] mb-12 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Event Visuals & Key Logistics (Profile Sidebar Style) */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-md shadow-2xl">
              <div className="relative aspect-square rounded-2xl overflow-hidden border-4 border-purple-500 mb-6 shadow-xl isolate">
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-4 left-4 bg-purple-600 px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
                    {event.genre}
                </div>
              </div>

              <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 leading-none">{event.name}</h2>
              <p className={`${isHistorical ? 'text-amber-500' : 'text-purple-400'} font-bold text-xs uppercase tracking-widest mb-6`}>
                {isHistorical ? 'Historical Event' : 'Live Event'}
              </p>
              
              <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Date</h3>
                  <p className="text-gray-300 font-medium">{formattedDate}</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Doors</h3>
                  <p className="text-gray-300 font-medium">{event.start_time}</p>
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Venue</h3>
                  <p className="text-gray-300 font-medium">{event.venue_name}</p>
                </div>
              </div>

              {event.ticket_link && (
                <a 
                    href={event.ticket_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black text-[10px] uppercase tracking-[0.2em] py-4 rounded-xl transition duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 active:scale-[0.98] mt-8"
                >
                    Book Tickets
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    </svg>
                </a>
              )}

              <button 
                onClick={async () => {
                  const url = window.location.href
                  const title = `Check out ${event.name} on WatGig!`
                  const text = `${event.name} live at ${event.venue_name}. Join me!`

                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: title,
                        text: text,
                        url: url,
                      })
                    } catch (err) {
                      // Silently handle cancellation or minor errors
                    }
                  } else {
                    try {
                      await navigator.clipboard.writeText(url)
                      toast.success('Link copied to clipboard!')
                    } catch (err) {
                      // Fallback for copy failure
                    }
                  }
                }}
                className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 active:scale-[0.98] group shadow-xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share Event
              </button>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-md">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 mb-6">Posted By</h3>
              <Link 
                to={`/profile/${event.created_by}`}
                className="flex flex-col items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
              >
                {event.creator_image && (
                    <img 
                        src={event.creator_image} 
                        alt={event.creator_name} 
                        className="w-16 h-16 rounded-full object-cover border-2 border-purple-500 group-hover:scale-105 transition-transform shadow-lg"
                    />
                )}
                <span className="text-sm font-bold text-white uppercase tracking-wider text-center line-clamp-1">
                    {event.creator_name || "Unknown"}
                </span>
              </Link>
              <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-6 text-center">
                Published on {createdAt}
              </p>
            </div>

          </div>

          {/* Right Column: Content & Map (Profile Main Style) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
                <div className="p-8 pb-4">
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter border-l-4 border-purple-600 pl-6">
                        About the Event
                    </h2>
                </div>
                <div className="p-8 pt-4">
                    <div className="flex items-center gap-3 text-2xl font-bold text-gray-400 italic mb-6">
                        <span>Featuring:</span>
                        <span className="text-white">{event.artists}</span>
                    </div>
                    <p className="text-xl text-gray-300 leading-relaxed font-medium">
                        {event.description}
                    </p>
                </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
                <div className="p-8 pb-4 flex flex-col gap-2">
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter border-l-4 border-red-500 pl-6">
                        Location
                    </h2>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest ml-10">{event.address}</p>
                </div>
                <div className="p-8 pt-4">
                    {event.venue_name && (event.address || (event.lat && event.lng)) && (
                        <EventMap 
                            lat={event.lat} 
                            lng={event.lng} 
                            venueName={event.venue_name} 
                            address={event.address} 
                        />
                    )}
                </div>
            </div>
          </div>
        </div>
      </section>

      <RelatedEvents currentEventId={event.id} genre={event.genre} />
    </div>
  )
}

export default EventDetails