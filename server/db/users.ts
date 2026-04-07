import connection from './connection.js'
import { User, UserData } from '../../models/users.ts'

const columns = ['favouriteFruit']

export async function getUserById(
  auth0Id: string,
  db = connection,
): Promise<UserData> {
  return db('users').select().where('auth0Id', auth0Id).first()
}

export async function addUser(
  newUser: User,
  db = connection,
): Promise<UserData[]> {
  return db('users')
    .insert(newUser)
    .returning([...columns])
}