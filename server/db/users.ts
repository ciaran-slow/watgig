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
  return db('users').where('id', id).select().first()
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
