import { useParams, Link, useNavigate } from "react-router"
import { useUserDetails, useUser, useSavedEvents, useFollowing, useToggleFollowUser } from "../hooks/users"
import { useUserEvents, useDeleteEvent } from "../hooks/events"
import { format, parseISO } from "date-fns"
import Hero from "./Hero"
import EventCard from "./EventCard"
import SavedEventsCalendar from "./SavedEventsCalendar"
import toast from "react-hot-toast"
import { useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"

function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { logout } = useAuth0()
  const { data: profileUser, isLoading: userLoading, isError: userError } = useUserDetails(Number(id))
  const user = useUser()
  const currentUser = user.data
  const { data: savedEvents, isLoading: savedLoading } = useSavedEvents()
  const { data: following, isLoading: followingLoading } = useFollowing()
  const toggleFollow = useToggleFollowUser()
  const deleteEvent = useDeleteEvent()

  const [sections, setSections] = useState({
    events: false,
    saved: true,
    following: false
  })

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }))
  }
  
  // Use the integer ID from the URL to fetch events
  const { data: events, isLoading: eventsLoading } = useUserEvents(id || '')

  if (userLoading) return <div className="p-12 text-center text-white">Loading profile...</div>
  if (userError || !profileUser) return <div className="p-12 text-center text-red-500">User not found.</div>

  const isOwnProfile = currentUser?.id === profileUser.id
  const isFollowing = following?.some((followedUser) => followedUser.id === profileUser.id)

  const showRoleTag = profileUser.role.toLowerCase() === 'band' || profileUser.role.toLowerCase() === 'venue'

  const handleFollowToggle = () => {
    if (!currentUser) {
      toast.error("Please login to follow users")
      return
    }
    toggleFollow.mutate({ userId: profileUser.id, isFollowing: !!isFollowing })
  }

  const handleDeleteProfile = () => {
    toast((t) => (
      <div className="flex flex-col gap-4 p-2">
        <div className="flex flex-col gap-2">
          <p className="font-black text-red-600 uppercase tracking-tighter text-lg">Warning: Permanent Action</p>
          <p className="text-sm font-medium text-gray-700 leading-tight">
            Deleting your WatGig profile removes its events, follows, notifications, and profile data. Your Auth0 login and previously uploaded Cloudinary media are managed separately.
          </p>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={async () => {
              toast.dismiss(t.id)
              try {
                await user.delete.mutateAsync()
                logout({ logoutParams: { returnTo: window.location.origin } })
              } catch (err) {
                // Handled by react-query
              }
            }}
            className="bg-red-600 text-white px-6 py-2.5 rounded-xl hover:bg-red-800 transition text-xs font-black uppercase tracking-widest shadow-lg active:scale-95"
          >
            Delete WatGig Profile
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-100 text-gray-500 px-6 py-2.5 rounded-xl hover:bg-gray-200 transition text-xs font-black uppercase tracking-widest active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
      style: {
        maxWidth: '400px',
        padding: '16px',
        borderRadius: '24px',
      }
    })
  }

  const handleDelete = (eventId: number, eventName: string) => {
    toast((t) => (
      <div className="flex flex-col gap-4">
        <p className="font-semibold text-center text-gray-800 text-sm">Delete “{eventName}”?</p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => {
              deleteEvent.mutate(eventId)
              toast.dismiss(t.id)
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition text-xs font-bold shadow-md"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition text-xs font-bold"
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
    <div className="bg-[#0a0a0a] min-h-screen">
      <Hero 
        title={profileUser.name}
        image={profileUser.profile_image}
        subtitle=""
        tag={showRoleTag ? profileUser.role.toUpperCase() : ""}
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
              
              {!isOwnProfile && currentUser && (
                <button
                  onClick={handleFollowToggle}
                  className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] mb-6 transition-all active:scale-95 ${
                    isFollowing 
                      ? 'bg-white/5 border border-white/10 text-white hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500' 
                      : 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-900/20'
                  }`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow User'}
                </button>
              )}

              {isOwnProfile && (
                <div className="flex flex-col gap-3 mb-8">
                  <Link
                    to="/profile/edit"
                    className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] bg-white/5 border border-white/10 text-white hover:bg-white/10 text-center transition-all active:scale-95"
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={handleDeleteProfile}
                    className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] bg-red-600/10 border border-red-500/20 text-red-500 hover:bg-red-600 hover:text-white transition-all active:scale-95"
                  >
                    Delete Account
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
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
                {showRoleTag && (
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 mb-1">Followers</h3>
                    <p className="text-2xl font-black text-white tracking-tighter">{profileUser.follower_count || 0}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-md">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 mb-4">Biography</h3>
              <p className="text-gray-400 leading-relaxed italic">
                “{profileUser.bio || 'No bio provided.'}”
              </p>
            </div>
          </div>

          {/* Main: User Events */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Saved Events Section */}
            {isOwnProfile && (
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
                <button 
                  onClick={() => toggleSection('saved')}
                  className="w-full p-8 flex justify-between items-center hover:bg-white/[0.02] transition-colors group text-left"
                >
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter border-l-4 border-red-500 pl-6">
                    Saved Events
                  </h2>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-8 w-8 text-gray-500 transition-transform duration-300 ${sections.saved ? 'rotate-180' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {sections.saved && (
                  <div className="p-8 pt-0">
                    {savedLoading ? (
                      <div className="text-gray-500 italic">Loading saved events...</div>
                    ) : (
                      <SavedEventsCalendar events={savedEvents || []} />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* My Events / Events Section */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
              {isOwnProfile ? (
                <button 
                  onClick={() => toggleSection('events')}
                  className="w-full p-8 flex justify-between items-center hover:bg-white/[0.02] transition-colors group text-left"
                >
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter border-l-4 border-purple-600 pl-6">
                    My Events
                  </h2>
                  <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-8 w-8 text-gray-500 transition-transform duration-300 ${sections.events ? 'rotate-180' : ''}`} 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ) : (
                <div className="p-8 pb-8">
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter border-l-4 border-purple-600 pl-6">
                    Events
                  </h2>
                </div>
              )}

              {(sections.events || !isOwnProfile) && (
                <div className="p-8 pt-0">
                  {eventsLoading ? (
                    <div className="text-gray-500 italic">Loading events...</div>
                  ) : events && events.length > 0 ? (
                    isOwnProfile ? (
                      /* Table view for own profile */
                      <div className="overflow-x-auto rounded-2xl border border-white/5 bg-white/[0.02]">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                          <thead>
                            <tr className="border-b border-white/5">
                              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Event</th>
                              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Date</th>
                              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Venue</th>
                              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Genre</th>
                              <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {events.map(event => (
                              <tr key={event.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group">
                                <td className="p-6">
                                  <Link to={`/event/${event.id}`} className="text-white font-bold hover:text-purple-400 transition-colors uppercase tracking-tight">
                                    {event.name}
                                  </Link>
                                </td>
                                <td className="p-6 text-gray-400 text-sm font-medium">
                                  {event.date ? format(parseISO(event.date), 'dd MMM yyyy') : 'N/A'}
                                </td>
                                <td className="p-6 text-gray-400 text-sm font-medium">{event.venue_name}</td>
                                <td className="p-6">
                                  <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-black uppercase text-gray-400 tracking-widest border border-white/5">
                                    {event.genre}
                                  </span>
                                </td>
                                <td className="p-6 text-right">
                                  <div className="flex justify-end gap-2">
                                    <Link
                                      to={`/event/${event.id}/edit`}
                                      className="p-2 bg-purple-600/10 border border-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white transition-all shadow-lg"
                                      title="Edit"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                    </Link>
                                    <button
                                      onClick={() => handleDelete(event.id, event.name)}
                                      className="p-2 bg-red-600/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-lg"
                                      title="Delete"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      /* Grid view for other profiles */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {events.map(event => (
                          <EventCard 
                            key={event.id} 
                            event={event} 
                            showAdminActions={false}
                          />
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="bg-white/[0.02] border border-dashed border-white/10 p-12 rounded-2xl text-center">
                      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No events found.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Following Section */}
            {isOwnProfile && (
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
                <button 
                  onClick={() => toggleSection('following')}
                  className="w-full p-8 flex justify-between items-center hover:bg-white/[0.02] transition-colors group text-left"
                >
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter border-l-4 border-blue-500 pl-6">
                    Following
                  </h2>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-8 w-8 text-gray-500 transition-transform duration-300 ${sections.following ? 'rotate-180' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {sections.following && (
                  <div className="p-8 pt-0">
                    {followingLoading ? (
                      <div className="text-gray-500 italic">Loading following...</div>
                    ) : following && following.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {following.map((user) => (
                          <Link 
                            key={user.id} 
                            to={`/profile/${user.id}`}
                            className="relative flex flex-col items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                          >
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                toggleFollow.mutate({ userId: user.id, isFollowing: true })
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-black/40 rounded-full text-gray-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg z-10"
                              title="Unfollow"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <img 
                              src={user.profile_image} 
                              alt={user.name} 
                              className="w-16 h-16 rounded-full object-cover border-2 border-purple-500 group-hover:scale-105 transition-transform shadow-lg"
                            />
                            <span className="text-sm font-bold text-white uppercase tracking-wider text-center line-clamp-1">{user.name}</span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white/[0.02] border border-dashed border-white/10 p-12 rounded-2xl text-center">
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Not following anyone yet.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Profile
