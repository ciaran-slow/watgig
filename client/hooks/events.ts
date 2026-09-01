import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as api from '../apis/events.ts'
import { EditableEvent, EventWithId, NewEvent } from '../../models/event.ts'
import { useAuth0 } from '@auth0/auth0-react'

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => api.getEvents(),
  })
}

export function useEvent(id: number) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => api.getEventById(id),
    enabled: !!id,
  })
}

export function useUserEvents(userId: string) {
  return useQuery({
    queryKey: ['events', 'user', userId],
    queryFn: () => api.getEventsByUser(userId),
    enabled: !!userId,
  })
}

export function useAddEvent() {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  return useMutation({
    mutationFn: async (newEvent: NewEvent) => {
      const token = await getAccessTokenSilently()
      return api.addEvent(newEvent, token)
    },
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

export function useUpdateEvent() {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  return useMutation({
    mutationFn: async ({ id, updatedEvent }: { id: number, updatedEvent: EditableEvent }) => {
      const token = await getAccessTokenSilently()
      return api.updateEvent(id, updatedEvent, token)
    },
    onSuccess: (_, variables) => {
      toast.success('Event updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['event', variables.id] })
    },
    onError: (err) => {
      toast.error(`Failed to update event: ${err.message}`)
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  return useMutation({
    mutationFn: async (id: number) => {
      const token = await getAccessTokenSilently()
      return api.deleteEvent(id, token)
    },
    onSuccess: () => {
      toast.success('Event deleted successfully!')
      return queryClient.invalidateQueries({ queryKey: ['events'] })
    },
    onError: (err) => {
      toast.error(`Failed to delete event: ${err.message}`)
    },
  })
}
