exports.up = (knex) =>
  knex.schema.createTable("tags", (table) => {
    table.increments("id");
    table.text("name").notNullable(); // Não aceito nulo.

    table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE");
    // Significa que se eu deletar a nota que esta tag está vinculada, automaticamente ele vai deletar a tag também.
    table.integer("user_id").references("id").inTable("users");
  });

exports.down = (knex) => knex.schema.dropTable("tags");
