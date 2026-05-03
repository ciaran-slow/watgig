// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as hooks from '../hooks/events'
import * as api from '../apis/events'
import React from 'react'

vi.mock('../apis/events')

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useEvents', () => {
  it('fetches events successfully', async () => {
    const mockEvents = [{ id: 1, name: 'Test Event' }]
    vi.mocked(api.getEvents).mockResolvedValue(mockEvents as any)

    const { result } = renderHook(() => hooks.useEvents(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockEvents)
  })
})

describe('useAddEvent', () => {
  it('adds an event and invalidates queries', async () => {
    const newEvent = { name: 'New Event' }
    vi.mocked(api.addEvent).mockResolvedValue({ ...newEvent, id: 1 } as any)

    const { result } = renderHook(() => hooks.useAddEvent(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync(newEvent as any)
    expect(api.addEvent).toHaveBeenCalledWith(newEvent)
  })
})
