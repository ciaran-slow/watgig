export async function seed(knex) {
  await knex('following').insert([
    { user_id: 1, event_id: 2 },
    { user_id: 1, event_id: 5 },
    { user_id: 2, event_id: 1 },
    { user_id: 2, event_id: 3 },
    { user_id: 2, event_id: 9 },
    { user_id: 3, event_id: 4 },
    { user_id: 3, event_id: 7 },
    { user_id: 4, event_id: 6 },
    { user_id: 4, event_id: 10 },
    { user_id: 5, event_id: 11 },
    { user_id: 5, event_id: 12 },
    { user_id: 6, event_id: 13 },
    { user_id: 6, event_id: 14 },
    { user_id: 7, event_id: 15 },
    { user_id: 7, event_id: 16 },
    { user_id: 8, event_id: 17 },
    { user_id: 8, event_id: 18 },
    { user_id: 9, event_id: 19 },
    { user_id: 9, event_id: 20 },
    { user_id: 10, event_id: 1 }
  ])
}