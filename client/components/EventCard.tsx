import { EventWithId } from "../../models/event"
import eventbg from '../public/eventbg.webp'
import { useDeleteEvent } from "../hooks/events"
import toast from "react-hot-toast"

interface Props {
  event: EventWithId
}

function EventCard({ event }: Props) {
  const deleteEvent = useDeleteEvent()
  const backgroundImage = event.image_url ? `url(${event.image_url})` : `url(${eventbg})`

  // For now, we are hardcoding created_by to '1' in AddEvent,
  // so we'll consider anything with '1' as owned by the current user.
  const isOwner = String(event.created_by) === '1'

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation() 
    
    toast((t) => (
      <div className="flex flex-col gap-4">
        <p className="font-semibold text-center">Delete "{event.name}"?</p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => {
              deleteEvent.mutate(event.id)
              toast.dismiss(t.id)
            }}
            className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-800 transition text-sm font-bold"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 text-black px-3 py-1 rounded-lg hover:bg-gray-300 transition text-sm font-bold"
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

  return (
    <div className="relative group">
      <button
        className="relative p-6 rounded-xl h-[600px] shadow-slate-700 shadow-md border-4 text-white hover:scale-105 hover:border-purple-800 transition ease-in-out cursor-pointer focus:outline-none focus:ring-4 focus:ring-purple-500 w-full"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.8)), ${backgroundImage}`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleteEvent.isPending}
            className="absolute top-6 left-6 bg-red-600 hover:bg-red-800 text-white p-2 rounded-xl shadow-lg transition transform hover:scale-110 z-10 focus:outline-none focus:ring-4 focus:ring-red-500 disabled:opacity-50"
            title="Delete Event"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
        {!!event.featured && (
          <div className="absolute top-6 right-6 bg-purple-800 p-2 rounded-xl">
            <p>Featured Event</p>
          </div>
        )}

        <div className="absolute bottom-6 left-6 p-4 rounded-xl bg-black border-2 border-purple-800 w-[90%] text-left">
          <h2 className="text-xl font-bold">{event.date}</h2>
          <h2 className="text-4xl font-bold">{event.name}</h2>
          <h3 className="text-xl font-bold">Featuring:</h3>
          <h3 className="font-thin line-clamp-2">{event.artists}</h3>
          <h3 className="font-bold">{event.venue_name}</h3>
        </div>
      </button>

      
    </div>
  )
}

export default EventCard