/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Check if we are running in PostgreSQL
  if (knex.client.config.client === 'postgresql') {
    // Convert users.id to auto-incrementing SERIAL
    await knex.raw('CREATE SEQUENCE IF NOT EXISTS users_id_seq')
    await knex.raw('ALTER TABLE users ALTER COLUMN id SET DEFAULT nextval(\'users_id_seq\')')
    await knex.raw('SELECT setval(\'users_id_seq\', (SELECT MAX(id) FROM users))')

    // Convert event.id to auto-incrementing SERIAL
    await knex.raw('CREATE SEQUENCE IF NOT EXISTS event_id_seq')
    await knex.raw('ALTER TABLE event ALTER COLUMN id SET DEFAULT nextval(\'event_id_seq\')')
    await knex.raw('SELECT setval(\'event_id_seq\', (SELECT MAX(id) FROM event))')
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  if (knex.client.config.client === 'postgresql') {
    await knex.raw('ALTER TABLE users ALTER COLUMN id DROP DEFAULT')
    await knex.raw('DROP SEQUENCE IF EXISTS users_id_seq')
    
    await knex.raw('ALTER TABLE event ALTER COLUMN id DROP DEFAULT')
    await knex.raw('DROP SEQUENCE IF EXISTS event_id_seq')
  }
}
