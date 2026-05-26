/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('notifications', (table) => {
    table.increments('id').primary()
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.integer('event_id').references('id').inTable('event').onDelete('CASCADE')
    table.boolean('is_read').defaultTo(false)
    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('notifications')
}
