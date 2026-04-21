/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.alterTable('event', (table) => {
    table.string('address')
    table.float('lat')
    table.float('lng')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.alterTable('event', (table) => {
    table.dropColumn('address')
    table.dropColumn('lat')
    table.dropColumn('lng')
  })
}
