import request from 'superagent'
import { NewUserData, NotificationData, PublicUser, UserData } from '../../models/users.ts'
import { EventWithId } from '../../models/event.ts'

const rootURL = '/api/v1'

interface GetUserFunction {
  token: string
}
export async function getUser({
  token,
}: GetUserFunction): Promise<UserData | null> {
  try {
    const res = await request
      .get(`${rootURL}/users`)
      .set('Authorization', `Bearer ${token}`)
    return res.body.user || null
  } catch (error: unknown) {
    if (isHttpStatus(error, 404)) return null
    throw error
  }
}

export async function getUserDetails(id: number): Promise<UserData> {
  return request
    .get(`${rootURL}/users/details/${id}`)
    .then((res) => res.body)
}

interface AddUserFunction {
  newUser: NewUserData
  token: string
}
export async function addUser({
  newUser,
  token,
}: AddUserFunction): Promise<UserData> {
  const res = await request
    .post(`${rootURL}/users`)
    .set('Authorization', `Bearer ${token}`)
    .send(newUser)
  return res.body.user
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
}

function isHttpStatus(error: unknown, status: number) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    error.status === status
  )
}

export async function getSavedEvents(token: string): Promise<EventWithId[]> {
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

export async function getFollowing(token: string): Promise<PublicUser[]> {
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

export async function getNotifications(token: string): Promise<NotificationData[]> {
  return request
    .get(`${rootURL}/users/notifications`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => res.body)
}

export async function markNotificationAsRead(id: number, token: string) {
  return request
    .patch(`${rootURL}/users/notifications/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => res.body)
}

export async function deleteNotification(id: number, token: string) {
  return request
    .delete(`${rootURL}/users/notifications/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => res.body)
}
