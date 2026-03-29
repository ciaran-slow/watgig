export async function seed(knex) {
  await knex('users').insert([
    { id: 1, name: 'Admin User', email: 'admin@watgig.com', role: 'admin', profile_image: 'https://picsum.photos/seed/user1/200' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'user', profile_image: 'https://picsum.photos/seed/user2/200' },
    { id: 3, name: 'Sam Carter', email: 'sam@example.com', role: 'user', profile_image: 'https://picsum.photos/seed/user3/200' },
    { id: 4, name: 'Alex Rivers', email: 'alex@example.com', role: 'user', profile_image: 'https://picsum.photos/seed/user4/200' },
    { id: 5, name: 'Taylor West', email: 'taylor@example.com', role: 'user', profile_image: 'https://picsum.photos/seed/user5/200' },
    { id: 6, name: 'Jordan Blake', email: 'jordan@example.com', role: 'user', profile_image: 'https://picsum.photos/seed/user6/200' },
    { id: 7, name: 'Morgan Lee', email: 'morgan@example.com', role: 'user', profile_image: 'https://picsum.photos/seed/user7/200' },
    { id: 8, name: 'Chris Knight', email: 'chris@example.com', role: 'user', profile_image: 'https://picsum.photos/seed/user8/200' },
    { id: 9, name: 'Jamie Stone', email: 'jamie@example.com', role: 'user', profile_image: 'https://picsum.photos/seed/user9/200' },
    { id: 10, name: 'Riley Fox', email: 'riley@example.com', role: 'user', profile_image: 'https://picsum.photos/seed/user10/200' }
  ])
}