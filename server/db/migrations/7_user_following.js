export async function up(knex) {
  await knex.schema.createTable('user_following', (table) => {
    table.integer('follower_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')

    table.integer('followed_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')

    table.primary(['follower_id', 'followed_id'])
  })
}

export async function down(knex) {
  await knex.schema.dropTable('user_following')
}
