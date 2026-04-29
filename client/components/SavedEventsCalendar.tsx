import { useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns'
import { EventWithId } from '../../models/event'
import { Link } from 'react-router'

interface Props {
  events: EventWithId[]
}

export default function SavedEventsCalendar({ events }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const eventsOnSelectedDay = events.filter((event) =>
    event.date ? isSameDay(parseISO(event.date), selectedDate) : false
  )

  return (
    <div className="bg-white/[0.01] rounded-3xl p-6 md:p-8 border border-white/5 backdrop-blur-sm">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-black text-white uppercase tracking-tight">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            title="Previous Month"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            title="Next Month"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-[10px] font-black uppercase tracking-widest text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, idx) => {
          const dayEvents = events.filter((e) => e.date ? isSameDay(parseISO(e.date), day) : false)
          const isSelected = isSameDay(day, selectedDate)
          const isCurrentMonth = isSameMonth(day, monthStart)
          const isToday = isSameDay(day, new Date())

          return (
            <button
              key={idx}
              onClick={() => setSelectedDate(day)}
              className={`
                relative aspect-square flex flex-col items-center justify-center rounded-2xl transition-all duration-300 border
                ${!isCurrentMonth ? 'text-gray-800 border-transparent opacity-20' : 'text-gray-300 border-transparent'}
                ${isSelected 
                  ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-900/40 scale-105 z-10' 
                  : 'hover:bg-white/5 hover:border-white/10'}
                ${isToday && !isSelected ? 'border-purple-500/50 text-purple-400 bg-purple-500/5' : ''}
              `}
            >
              <span className="text-sm font-bold">{format(day, 'd')}</span>
              {dayEvents.length > 0 && (
                <div className="mt-1 flex gap-0.5 justify-center flex-wrap px-1 max-w-full">
                   {dayEvents.slice(0, 3).map((_, i) => (
                     <div key={i} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-purple-500'}`} />
                   ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Events List for Selected Day */}
      <div className="mt-8 pt-8 border-t border-white/5">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {format(selectedDate, 'do MMMM yyyy')}
          </h4>
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md border border-purple-500/20">
            {eventsOnSelectedDay.length} {eventsOnSelectedDay.length === 1 ? 'Event' : 'Events'}
          </span>
        </div>

        {eventsOnSelectedDay.length > 0 ? (
          <div className="flex flex-col gap-3">
            {eventsOnSelectedDay.map((event) => (
              <Link
                key={event.id}
                to={`/event/${event.id}`}
                className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.08] transition-all group hover:border-purple-500/30"
              >
                <div className="flex flex-col">
                  <span className="text-white font-bold group-hover:text-purple-400 transition-colors uppercase tracking-tight">{event.name}</span>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {event.start_time}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.venue_name}
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-white/5 rounded-full group-hover:bg-purple-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-white transform group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
            <p className="text-xs font-black uppercase tracking-widest text-gray-600">No saved events for this day</p>
          </div>
        )}
      </div>
    </div>
  )
}
