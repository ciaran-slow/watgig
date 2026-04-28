export interface User extends UserData {
  auth0Id: string
}

export interface UserData {
  id?: number
  name: string
  email: string
  role: string
  profile_image: string
  bio?: string
  genre?: string
  members?: string
  address?: string
  follower_count?: number
}
