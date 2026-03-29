import { describe, it, expect, afterEach } from 'vitest'
import nock from 'nock'
import { getRandomDogImage } from './externalApi'

afterEach(() => {
  nock.cleanAll()
})

describe('getRandomDogImage', () => {
  it('returns the dog image URL from the external API', async () => {
    const scope = nock('https://dog.ceo')
      .get('/api/breeds/image/random')
      .reply(200, {
        message: 'https://images.dog.ceo/breeds/terrier-norwich/n02094114_1143.jpg',
        status: 'success'
      })

    const result = await getRandomDogImage()
    
    expect(result).toBe('https://images.dog.ceo/breeds/terrier-norwich/n02094114_1143.jpg')
    expect(scope.isDone()).toBe(true)
  })

  it('handles API errors gracefully', async () => {
    nock('https://dog.ceo')
      .get('/api/breeds/image/random')
      .reply(500, { message: 'Internal Server Error', status: 'error' })

    await expect(getRandomDogImage()).rejects.toThrow()
  })
})
