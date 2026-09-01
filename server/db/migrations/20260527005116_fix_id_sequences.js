/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Check if we are running in PostgreSQL
  if (knex.client.config.client === 'postgresql') {
    if (await knex.schema.hasTable('users')) {
      await knex.raw('CREATE SEQUENCE IF NOT EXISTS users_id_seq')
      await knex.raw('ALTER SEQUENCE users_id_seq OWNED BY users.id')
      await knex.raw('ALTER TABLE users ALTER COLUMN id SET DEFAULT nextval(\'users_id_seq\')')
      await knex.raw("SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1), EXISTS (SELECT 1 FROM users))")
    }

    // On a fresh database this migration sorts before 2_event.js.
    // The final sequence migration handles event after all tables exist.
    if (await knex.schema.hasTable('event')) {
      await knex.raw('CREATE SEQUENCE IF NOT EXISTS event_id_seq')
      await knex.raw('ALTER SEQUENCE event_id_seq OWNED BY event.id')
      await knex.raw('ALTER TABLE event ALTER COLUMN id SET DEFAULT nextval(\'event_id_seq\')')
      await knex.raw("SELECT setval('event_id_seq', COALESCE((SELECT MAX(id) FROM event), 1), EXISTS (SELECT 1 FROM event))")
    }
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  if (knex.client.config.client === 'postgresql') {
    if (await knex.schema.hasTable('users')) {
      await knex.raw('ALTER TABLE users ALTER COLUMN id DROP DEFAULT')
    }
    await knex.raw('DROP SEQUENCE IF EXISTS users_id_seq')

    if (await knex.schema.hasTable('event')) {
      await knex.raw('ALTER TABLE event ALTER COLUMN id DROP DEFAULT')
    }
    await knex.raw('DROP SEQUENCE IF EXISTS event_id_seq')
  }
}
