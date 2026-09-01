// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import { MemoryRouter } from 'react-router'
import { useAuth0 } from '@auth0/auth0-react'
import { useUser, useNotifications } from '../hooks/users'
import { useEvents } from '../hooks/events'
import { LocationProvider } from '../components/LocationContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

vi.mock('@auth0/auth0-react')
vi.mock('../hooks/users')
vi.mock('../hooks/events')

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

describe('Footer', () => {
  it('renders the copyright notice', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeDefined()
  })
})

describe('Nav', () => {
  it('renders login link when not authenticated', () => {
    vi.mocked(useAuth0).mockReturnValue({
      isAuthenticated: false,
      user: null,
      loginWithRedirect: vi.fn(),
      logout: vi.fn(),
    } as any)
    vi.mocked(useUser).mockReturnValue({ data: null } as any)
    vi.mocked(useNotifications).mockReturnValue({ data: [] } as any)
    vi.mocked(useEvents).mockReturnValue({ data: [] } as any)

    render(
      <QueryClientProvider client={queryClient}>
        <LocationProvider>
          <MemoryRouter>
            <Nav />
          </MemoryRouter>
        </LocationProvider>
      </QueryClientProvider>
    )

    expect(screen.getAllByText(/Login\/Sign Up/i)).toBeDefined()
  })

  it('renders user name and logout when authenticated', () => {
    vi.mocked(useAuth0).mockReturnValue({
      isAuthenticated: true,
      user: { name: 'Test User' },
      loginWithRedirect: vi.fn(),
      logout: vi.fn(),
    } as any)
    vi.mocked(useUser).mockReturnValue({
      data: { id: 1, name: 'Test User', profile_image: '' }
    } as any)
    vi.mocked(useNotifications).mockReturnValue({ data: [] } as any)
    vi.mocked(useEvents).mockReturnValue({ data: [] } as any)

    render(
      <QueryClientProvider client={queryClient}>
        <LocationProvider>
          <MemoryRouter>
            <Nav />
          </MemoryRouter>
        </LocationProvider>
      </QueryClientProvider>
    )

    expect(screen.getAllByText(/Test User/i)).toBeDefined()
    expect(screen.getAllByText(/Logout/i)).toBeDefined()
  })
})
