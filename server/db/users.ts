import connection from './connection.ts'
import { User, UserData } from '../../models/users.ts'

export async function getUserById(
  auth0Id: string,
  db = connection,
): Promise<UserData> {
  return db('users').where('auth0Id', auth0Id).select().first()
}

export async function getUserDetailsById(
  id: number,
  db = connection,
): Promise<UserData> {
  return db('users')
    .where('id', id)
    .select('*', 
      db('user_following')
        .count('*')
        .whereRaw('user_following.followed_id = users.id')
        .as('follower_count')
    )
    .first()
}

export async function getUserByName(
  name: string,
  db = connection,
): Promise<UserData> {
  return db('users').where('name', name).select().first()
}

export async function addUser(
  newUser: User,
  db = connection,
): Promise<UserData> {
  const [addedUser] = await db('users')
    .insert(newUser)
    .returning('*')
  return addedUser
}

// User Following
export async function followUser(followerId: number, followedId: number, db = connection) {
  return db('user_following').insert({ follower_id: followerId, followed_id: followedId })
}

export async function unfollowUser(followerId: number, followedId: number, db = connection) {
  return db('user_following').where({ follower_id: followerId, followed_id: followedId }).delete()
}

export async function getFollowing(followerId: number, db = connection): Promise<UserData[]> {
  return db('users')
    .join('user_following', 'users.id', 'user_following.followed_id')
    .where('user_following.follower_id', followerId)
    .select('users.*')
}

export async function getFollowers(followedId: number, db = connection): Promise<UserData[]> {
  return db('users')
    .join('user_following', 'users.id', 'user_following.follower_id')
    .where('user_following.followed_id', followedId)
    .select('users.*')
}

export async function deleteUser(id: number, db = connection): Promise<number> {
  return db('users').where('id', id).delete()
}

export async function updateUser(id: number, updatedUser: Partial<UserData>, db = connection): Promise<number> {
  return db('users').where('id', id).update(updatedUser)
}
