import { MutationFunction, useQuery } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import * as API from '../apis/users.ts'
import { useAuth0 } from '@auth0/auth0-react'
import { UserData } from '../../models/users.ts' // Import UserData type

export function useUser() {
  const { user, getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient() // Get queryClient here

  const query = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return API.getUser({ token })
    },
    enabled: !!user, // Only enable if user object from Auth0 is available
  })

  // Define the add user mutation directly within useUser hook
  const addUserMutation = useMutation({
    mutationFn: async (newUser: Omit<UserData, 'email'>) => {
      const token = await getAccessTokenSilently() // Get token here
      return API.addUser({ 
        newUser: { ...newUser, email: user?.email as string } as UserData, 
        token 
      })
    },
    onSuccess: () => {
      toast.success('Profile added successfully!')
      queryClient.invalidateQueries({ queryKey: ['user'] }) // Invalidate 'user' query to refetch data
    },
    onError: (err: any) => {
      toast.error(`Error: ${err.message || 'Something went wrong'}`)
    },
  })

  return {
    ...query,
    add: addUserMutation, // Return the mutation
    checkName: async (name: string) => {
      const token = await getAccessTokenSilently()
      return API.checkName({ name, token })
    },
  }
}

export function useUserDetails(id: number) {
  return useQuery({
    queryKey: ['user-details', id],
    queryFn: () => API.getUserDetails(id),
    enabled: !!id,
  })
}

export function useSavedEvents() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  return useQuery({
    queryKey: ['saved-events'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return API.getSavedEvents(token)
    },
    enabled: isAuthenticated,
  })
}

export function useToggleSaveEvent() {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ eventId, isSaved }: { eventId: number; isSaved: boolean }) => {
      const token = await getAccessTokenSilently()
      if (isSaved) {
        return API.unsaveEvent(eventId, token)
      } else {
        return API.saveEvent(eventId, token)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-events'] })
    },
    onError: (err: any) => {
      toast.error(`Error: ${err.message || 'Something went wrong'}`)
    },
  })
}
