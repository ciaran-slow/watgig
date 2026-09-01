import connection from './connection.ts'

export async function createNotification(userId: number, eventId: number, db = connection) {
  return db('notifications').insert({
    user_id: userId,
    event_id: eventId,
    is_read: false
  })
}

export async function createNotifications(userIds: number[], eventId: number, db = connection) {
  if (userIds.length === 0) return []
  return db('notifications').insert(
    userIds.map((userId) => ({ user_id: userId, event_id: eventId, is_read: false })),
  )
}

export async function getNotifications(userId: number, db = connection) {
  return db('notifications')
    .join('event', 'notifications.event_id', 'event.id')
    .join('users', 'event.created_by', 'users.id')
    .where('notifications.user_id', userId)
    .select(
      'notifications.*',
      'event.name as event_name',
      'users.name as creator_name'
    )
    .orderBy('notifications.created_at', 'desc')
}

export async function markAsRead(id: number, userId: number, db = connection) {
  return db('notifications').where({ id, user_id: userId }).update({ is_read: true })
}

export async function deleteNotification(id: number, userId: number, db = connection) {
  return db('notifications').where({ id, user_id: userId }).delete()
}
