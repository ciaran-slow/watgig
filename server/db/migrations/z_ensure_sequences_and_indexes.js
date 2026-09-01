export async function up(knex) {
  if (knex.client.config.client === 'postgresql') {
    for (const table of ['users', 'event']) {
      const sequence = `${table}_id_seq`
      await knex.raw(`CREATE SEQUENCE IF NOT EXISTS ${sequence}`)
      await knex.raw(`ALTER SEQUENCE ${sequence} OWNED BY ${table}.id`)
      await knex.raw(
        `ALTER TABLE ${table} ALTER COLUMN id SET DEFAULT nextval('${sequence}')`,
      )
      await knex.raw(
        `SELECT setval('${sequence}', COALESCE((SELECT MAX(id) FROM ${table}), 1), EXISTS (SELECT 1 FROM ${table}))`,
      )
    }
  }

  await knex.schema.alterTable('event', (table) => {
    table.index('created_by', 'event_created_by_idx')
    table.index('date', 'event_date_idx')
  })
  await knex.schema.alterTable('user_following', (table) => {
    table.index('followed_id', 'user_following_followed_idx')
  })
  await knex.schema.alterTable('notifications', (table) => {
    table.index(['user_id', 'created_at'], 'notifications_user_created_idx')
    table.index('event_id', 'notifications_event_idx')
  })
}

export async function down(knex) {
  await knex.schema.alterTable('notifications', (table) => {
    table.dropIndex(['user_id', 'created_at'], 'notifications_user_created_idx')
    table.dropIndex('event_id', 'notifications_event_idx')
  })
  await knex.schema.alterTable('user_following', (table) => {
    table.dropIndex('followed_id', 'user_following_followed_idx')
  })
  await knex.schema.alterTable('event', (table) => {
    table.dropIndex('created_by', 'event_created_by_idx')
    table.dropIndex('date', 'event_date_idx')
  })
}
