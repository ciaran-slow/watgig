export async function up(knex) {
  return knex.schema.createTable('event', (table) => {
    table.increments('id')
    table.string('date')
    table.string('name')
    table.string('description')
    table.string('artists')
    table.string('start_time')
    table.string('image_url')
    table.string('ticket_link')
    table.string('created_by')
    table.boolean('featured')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('event')
}
