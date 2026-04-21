import { useParams } from "react-router"
import { useUserDetails, useUser, useSavedEvents } from "../hooks/users"
import { useUserEvents } from "../hooks/events"
import Hero from "./Hero"
import EventCard from "./EventCard"

function Profile() {
  const { id } = useParams()
  const { data: profileUser, isLoading: userLoading, isError: userError } = useUserDetails(Number(id))
  const { data: currentUser } = useUser()
  const { data: savedEvents, isLoading: savedLoading } = useSavedEvents()
  
  // Use the integer ID from the URL to fetch events
  const { data: events, isLoading: eventsLoading } = useUserEvents(id || '')

  if (userLoading) return <div className="p-12 text-center text-white">Loading profile...</div>
  if (userError || !profileUser) return <div className="p-12 text-center text-red-500">User not found.</div>

  const isOwnProfile = currentUser?.id === profileUser.id

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Hero 
        title={profileUser.name}
        subtitle={profileUser.role.toUpperCase()}
        tag={profileUser.genre || "Music Enthusiast"}
        image={profileUser.profile_image}
      />

      <section className="p-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar: User Details */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-md shadow-2xl">
              <img 
                src={profileUser.profile_image} 
                alt={profileUser.name} 
                className="w-full aspect-square object-cover rounded-2xl border-4 border-purple-500 mb-6 shadow-xl"
              />
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">{profileUser.name}</h2>
              <p className="text-purple-400 font-bold text-xs uppercase tracking-widest mb-6">{profileUser.role}</p>
              
              <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Email</h3>
                  <p className="text-gray-300 font-medium">{profileUser.email}</p>
                </div>
                {profileUser.address && (
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Location</h3>
                    <p className="text-gray-300 font-medium">{profileUser.address}</p>
                  </div>
                )}
                {profileUser.members && (
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Members</h3>
                    <p className="text-gray-300 font-medium italic">{profileUser.members}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-md">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 mb-4">Biography</h3>
              <p className="text-gray-400 leading-relaxed italic">
                "{profileUser.bio || "No bio provided."}"
              </p>
            </div>
          </div>

          {/* Main: User Events */}
          <div className="lg:col-span-2 flex flex-col gap-12">
            <div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-8 border-l-4 border-purple-600 pl-6">
                {isOwnProfile ? "My Events" : "Events"}
              </h2>

              {eventsLoading ? (
                <div className="text-gray-500 italic">Loading events...</div>
              ) : events && events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      showAdminActions={isOwnProfile}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white/[0.02] border border-dashed border-white/10 p-12 rounded-3xl text-center">
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No events found.</p>
                </div>
              )}
            </div>

            {isOwnProfile && (
              <div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-8 border-l-4 border-red-500 pl-6">
                  Saved Events
                </h2>

                {savedLoading ? (
                  <div className="text-gray-500 italic">Loading saved events...</div>
                ) : (() => {
                  const now = new Date()
                  now.setHours(0, 0, 0, 0)
                  const upcomingSavedEvents = savedEvents?.filter((event: any) => new Date(event.date) >= now)

                  return upcomingSavedEvents && upcomingSavedEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {upcomingSavedEvents.map((event: any) => (
                        <EventCard 
                          key={event.id} 
                          event={event} 
                          showAdminActions={false}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/[0.02] border border-dashed border-white/10 p-12 rounded-3xl text-center">
                      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No upcoming saved events.</p>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Profile