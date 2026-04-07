export async function up(knex) {
  await knex.schema.createTable('users', (table) => {
    table.integer('id').primary()
    table.string('name')
    table.string('email').unique()
    table.string('role')
    table.string('profile_image')

    table.timestamps(true, true)
  })
}

export async function down(knex) {
  await knex.schema.dropTable('users')
}