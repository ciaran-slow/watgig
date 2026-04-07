export async function up(knex) {
  return knex.schema.table('event', (table) => {
    table.string('genre').defaultTo('other')
  })
}

export async function down(knex) {
  return knex.schema.table('event', (table) => {
    table.dropColumn('genre')
  })
}
