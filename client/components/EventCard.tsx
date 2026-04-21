import { EventWithId } from "../../models/event"
import eventbg from '../public/eventbg.webp'
import { useDeleteEvent } from "../hooks/events"
import toast from "react-hot-toast"
import { format, parseISO } from "date-fns"
import { useNavigate, Link } from "react-router"
import { useUser, useSavedEvents, useToggleSaveEvent } from "../hooks/users"

interface Props {
  event: EventWithId
  showAdminActions?: boolean
}

function EventCard({ event, showAdminActions = false }: Props) {
  const deleteEvent = useDeleteEvent()
  const navigate = useNavigate()
  const dbUser = useUser()
  const { data: savedEvents } = useSavedEvents()
  const toggleSave = useToggleSaveEvent()
  
  const backgroundImage = event.image_url ? `url(${event.image_url})` : `url(${eventbg})`

  // Format date using date-fns
  const formattedDate = event.date ? format(parseISO(event.date), 'EEE d MMM') : ''

  const isOwner = dbUser.data?.id === event.created_by
  const isSaved = savedEvents?.some((e: EventWithId) => e.id === event.id)

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!dbUser.data) {
      toast.error('Please login to save events')
      return
    }
    toggleSave.mutate({ eventId: event.id, isSaved: !!isSaved })
  }
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation() 
    e.preventDefault()
    
    toast((t) => (
      <div className="flex flex-col gap-4">
        <p className="font-semibold text-center text-gray-800">Delete "{event.name}"?</p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => {
              deleteEvent.mutate(event.id)
              toast.dismiss(t.id)
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition text-sm font-bold shadow-md"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm font-bold"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
    })
  }

  const handleCardClick = () => {
    navigate(`/event/${event.id}`)
  }

  return (
    <div 
      className="relative group h-[650px] w-full rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer bg-black border border-gray-800 isolate"
      style={{ maskImage: 'linear-gradient(white, white)' }} // Fix for rounded corners overflow in some browsers
      onClick={handleCardClick}
    >
      {/* Background Image with Gradient */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ 
          backgroundImage: backgroundImage,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Badges & Actions */}
      <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg">
          {event.genre}
        </div>
        {!!event.featured && (
          <div className="bg-purple-600 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-lg flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Featured
          </div>
        )}
      </div>

      <div className="absolute top-6 right-6 flex gap-2 z-30">
        {/* Save/Unsave Button - Only show if not owner */}
        {!isOwner && (
          <button
            onClick={handleSaveToggle}
            className={`backdrop-blur-md border p-2 rounded-full shadow-lg transition duration-300 ${
              isSaved 
                ? 'bg-red-500 border-red-500 text-white' 
                : 'bg-white/10 border-white/20 text-white hover:bg-red-500/20 hover:border-red-500/50'
            }`}
            title={isSaved ? 'Unsave Event' : 'Save Event'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isSaved ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}

        {/* Owner Actions */}
        {isOwner && showAdminActions && (
          <div className="flex gap-2">
            <Link
              to={`/event/${event.id}/edit`}
              onClick={(e) => e.stopPropagation()}
              className="bg-purple-600/20 backdrop-blur-md border border-purple-500/50 hover:bg-purple-600 text-white p-2 rounded-full shadow-lg transition duration-300 group/edit"
              title="Edit Event"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>

            <button
              onClick={handleDelete}
              disabled={deleteEvent.isPending}
              className="bg-red-600/20 backdrop-blur-md border border-red-500/50 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 group/delete"
              title="Delete Event"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex flex-col gap-4">
        {/* Date & Time Row */}
        <div className="flex items-center gap-4 text-purple-400 font-bold text-sm">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formattedDate}
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {event.start_time}
          </div>
        </div>

        {/* Name and Artists */}
        <div className="flex flex-col gap-1">
          <h2 className="text-4xl font-black text-white leading-none tracking-tight group-hover:text-purple-400 transition-colors duration-300">
            {event.name}
          </h2>
          <p className="text-lg font-medium text-gray-300 italic line-clamp-1">
            {event.artists}
          </p>
        </div>

        {/* Venue Row */}
        <div className="flex items-center gap-2 text-white/90">
          <div className="p-1.5 bg-purple-600 rounded-lg shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-bold tracking-wide">{event.venue_name}</span>
        </div>

        {/* Description - Expanded on Hover in a modern way or just snippet */}
        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed h-10 transition-all duration-300 group-hover:text-gray-200">
          {event.description}
        </p>

        {/* Actions Row */}
        <div className="flex gap-4 mt-2">
          <Link 
            to={`/event/${event.id}`}
            className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 active:scale-95"
            onClick={(e) => e.stopPropagation()}
          >
            See More
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 100-2H5z" />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* Decorative Overlay for depth */}
      <div className="absolute inset-0 border-[1px] border-white/5 rounded-3xl pointer-events-none z-30" />
    </div>
  )
}

export default EventCard