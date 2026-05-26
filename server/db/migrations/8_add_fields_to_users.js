export async function up(knex) {
  await knex.schema.table('users', (table) => {
    table.string('auth0Id').unique()
    table.string('bio')
    table.string('genre')
    table.string('members')
    table.string('address')
  })
}

export async function down(knex) {
  await knex.schema.table('users', (table) => {
    table.dropColumn('auth0Id')
    table.dropColumn('bio')
    table.dropColumn('genre')
    table.dropColumn('members')
    table.dropColumn('address')
  })
}
