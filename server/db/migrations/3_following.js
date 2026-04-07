export async function up(knex) {
  await knex.schema.createTable('following', (table) => {
    table.integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')

    table.integer('event_id')
      .references('id')
      .inTable('event')
      .onDelete('CASCADE')

    table.primary(['user_id', 'event_id'])
  })
}

export async function down(knex) {
  await knex.schema.dropTable('following')
}