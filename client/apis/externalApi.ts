import request from 'superagent'

export interface DogImage {
  message: string
  status: string
}

export async function getRandomDogImage(): Promise<string> {
  const response = await request.get('https://dog.ceo/api/breeds/image/random')
  const body = response.body as DogImage
  return body.message
}
