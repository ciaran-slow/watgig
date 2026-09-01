import { describe, expect, it } from 'vitest'
import { validateEvent, validateNewUser, validateUserUpdate } from '../validation'

describe('request validation', () => {
  it('drops identity and privilege fields from profile updates', () => {
    const update = validateUserUpdate({
      name: 'Safe Name',
      id: 999,
      auth0Id: 'attacker-controlled',
      email: 'replacement@example.com',
    })

    expect(update).toEqual({ name: 'Safe Name' })
    expect(() => validateUserUpdate({ role: 'admin' })).toThrow(
      'role must be user, band, or venue',
    )
  })

  it('rejects self-assigned administrative roles during registration', () => {
    expect(() =>
      validateNewUser({
        name: 'Attacker',
        email: 'attacker@example.com',
        role: 'admin',
        profile_image: 'https://example.com/profile.jpg',
      }),
    ).toThrow('role must be user, band, or venue')
  })

  it('allowlists editable event fields and validates external URLs', () => {
    const event = validateEvent(
      {
        name: 'Updated Event',
        created_by: 999,
        id: 999,
        ticket_link: 'https://tickets.example.com/show',
      },
      true,
    )

    expect(event).toEqual({
      name: 'Updated Event',
      ticket_link: 'https://tickets.example.com/show',
    })
    expect(() => validateEvent({ ticket_link: 'javascript:alert(1)' }, true)).toThrow(
      'ticket_link must use HTTP or HTTPS',
    )
  })
})
