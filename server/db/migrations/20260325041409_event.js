export async function up(knex) {
  return knex.schema.createTable('event', (table) => {
    table.increments('id').primary()

    table.date('date')
    table.string('name')
    table.text('description')
    table.string('artists')
    table.string('venue_name')

    table.string('start_time')
    table.string('image_url')
    table.string('ticket_link')

    table.boolean('featured').defaultTo(false)

    table
      .integer('created_by')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')

    table.timestamps(true, true)
  })
}

export async function down(knex) {
  return knex.schema.dropTable('event')
}
