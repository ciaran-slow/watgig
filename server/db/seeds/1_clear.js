export async function seed(knex) {
  await knex('event').del()
  await knex('users').del()
  await knex('following').del()
};
 