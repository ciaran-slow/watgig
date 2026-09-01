export interface User extends UserData {
  auth0Id: string
}

export interface UserData {
  id: number
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

export type NewUserData = Omit<UserData, 'id' | 'follower_count'>
export type NewUser = NewUserData & { auth0Id: string }

export type PublicUser = Pick<
  UserData,
  'id' | 'name' | 'role' | 'profile_image' | 'bio' | 'genre' | 'members' | 'address'
>

export interface NotificationData {
  id: number
  user_id: number
  event_id: number
  is_read: boolean
  created_at: string
  event_name: string
  creator_name: string
}
