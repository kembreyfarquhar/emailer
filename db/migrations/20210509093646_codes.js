const tableName = "codes";

exports.up = (knex) =>
  knex.schema.createTable(tableName, (table) => {
    table.increments("id");
    table
      .string("user_email", 40)
      .unique()
      .notNullable()
      .references("email")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.string("code", 4).notNullable();
    table.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTableIfExists(tableName);
