import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as api from '../apis/events.ts'
import { Event, EventWithId } from '../../models/event.ts'

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => api.getEvents(),
  })
}

export function useAddEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (newEvent: Event) => api.addEvent(newEvent),
    onSuccess: (addedEvent) => {
      toast.success('Event added successfully!')
      // Manually update the cache for an immediate, reliable update
      queryClient.setQueryData(['events'], (oldData: EventWithId[] | undefined) => {
        return oldData ? [addedEvent, ...oldData] : [addedEvent]
      })
      // Also invalidate to be sure we have the latest server state in the background
      return queryClient.invalidateQueries({ queryKey: ['events'] })
    },
    onError: (err) => {
      toast.error(`Failed to add event: ${err.message}`)
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.deleteEvent(id),
    onSuccess: () => {
      toast.success('Event deleted successfully!')
      return queryClient.invalidateQueries({ queryKey: ['events'] })
    },
    onError: (err) => {
      toast.error(`Failed to delete event: ${err.message}`)
    },
  })
}
