import { useState, useRef, useEffect } from 'react'
import { useNotifications } from '../hooks/users'
import { useNavigate } from 'react-router'
import { formatDistanceToNow, parseISO } from 'date-fns'

function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: notifications, markAsRead, deleteNotif } = useNotifications()
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications?.filter((n: any) => !n.is_read).length || 0

  const formatNotifDate = (dateStr: string) => {
    try {
      // SQLite returns dates as 'YYYY-MM-DD HH:MM:SS' without a Z.
      // We normalize this to ISO format 'YYYY-MM-DDTHH:MM:SSZ' to force UTC.
      const normalizedDate = dateStr.includes('Z') || dateStr.includes('+')
        ? dateStr
        : `${dateStr.replace(' ', 'T')}Z`
      
      return formatDistanceToNow(parseISO(normalizedDate), { addSuffix: true })
    } catch (err) {
      return 'just now'
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotificationClick = async (notif: any) => {
    if (!notif.is_read) {
      await markAsRead.mutateAsync(notif.id)
    }
    setIsOpen(false)
    navigate(`/event/${notif.event_id}`)
  }

  const handleDeleteNotification = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation() // Prevent navigating to the event
    await deleteNotif.mutateAsync(id)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-purple-400 transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#1a1a1a] border border-white/10 shadow-2xl z-[100] overflow-hidden">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-bold text-sm uppercase tracking-widest text-white">Notifications</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-white transition-colors p-1"
              aria-label="Close notifications"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {!notifications || notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.map((notif: any) => (
                <div key={notif.id} className="relative group/item">
                  <button
                    onClick={() => handleNotificationClick(notif)}
                    className={`w-full text-left p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 flex gap-3 items-start ${
                      !notif.is_read ? 'bg-purple-500/5' : ''
                    }`}
                  >
                    <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${!notif.is_read ? 'bg-purple-500' : 'bg-transparent'}`} />
                    <div className="flex flex-col gap-1 pr-8">
                      <p className="text-sm text-gray-200 leading-tight">
                        <span className="font-bold text-white">{notif.creator_name}</span> posted a new event: <span className="text-purple-400">{notif.event_name}</span>
                      </p>
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                        {formatNotifDate(notif.created_at)}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={(e) => handleDeleteNotification(e, notif.id)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-red-500 lg:text-gray-500 lg:hover:text-red-500 transition-colors"
                    aria-label="Delete notification"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
