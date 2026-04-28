import request from 'superagent'
import { User, UserData } from '../../models/users.ts'

const rootURL = new URL(`/api/v1`, document.baseURI)

interface GetUserFunction {
  token: string
}
export async function getUser({
  token,
}: GetUserFunction): Promise<User | null> {
  return await request
    .get(`${rootURL}/users`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => (res.body.user ? res.body.user : null))
    .catch((error) => console.log(error))
}

export async function getUserDetails(id: number): Promise<UserData> {
  return request
    .get(`${rootURL}/users/details/${id}`)
    .then((res) => res.body)
}

interface AddUserFunction {
  newUser: UserData
  token: string
}
export async function addUser({
  newUser,
  token,
}: AddUserFunction): Promise<User> {
  return request
    .post(`${rootURL}/users`)
    .set('Authorization', `Bearer ${token}`)
    .send(newUser)
    .then((res) => res.body.user)
    .catch((error) => console.log(error))
}

export async function updateUser(updatedUser: Partial<UserData>, token: string) {
  return request
    .patch(`${rootURL}/users`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedUser)
    .then((res) => res.body)
}

export async function deleteUser(token: string) {
  return request
    .delete(`${rootURL}/users`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => res.body)
}

interface CheckNameFunction {
  name: string
  token: string
}
export async function checkName({
  name,
  token,
}: CheckNameFunction): Promise<{ available: boolean; suggestions?: string[] }> {
  return request
    .get(`${rootURL}/users/check-name/${name}`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => res.body)
    .catch((error) => console.log(error))
}

export async function getSavedEvents(token: string) {
  return request
    .get(`${rootURL}/users/saved`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => res.body)
}

export async function saveEvent(eventId: number, token: string) {
  return request
    .post(`${rootURL}/users/saved/${eventId}`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => res.body)
}

export async function unsaveEvent(eventId: number, token: string) {
  return request
    .delete(`${rootURL}/users/saved/${eventId}`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => res.body)
}

export async function getFollowing(token: string) {
  return request
    .get(`${rootURL}/users/following`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => res.body)
}

export async function followUser(userId: number, token: string) {
  return request
    .post(`${rootURL}/users/follow/${userId}`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => res.body)
}

export async function unfollowUser(userId: number, token: string) {
  return request
    .delete(`${rootURL}/users/follow/${userId}`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => res.body)
}
