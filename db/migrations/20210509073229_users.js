const tableName = "users";

exports.up = (knex) =>
  knex.schema.createTable(tableName, (table) => {
    table.increments("id");
    table.string("email", 40).unique().notNullable();
    table.string("password");
    table.boolean("verified").defaultTo(false);
    table.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTableIfExists(tableName);
