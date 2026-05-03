// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import { MemoryRouter } from 'react-router'
import { useAuth0 } from '@auth0/auth0-react'
import { useUser } from '../hooks/users'
import React from 'react'

vi.mock('@auth0/auth0-react')
vi.mock('../hooks/users')

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

    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>
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

    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>
    )

    expect(screen.getAllByText(/Test User/i)).toBeDefined()
    expect(screen.getAllByText(/Logout/i)).toBeDefined()
  })
})
