exports.up = (knex) =>
  knex.schema.createTable("notes", (table) => {
    table.increments("id"); // increments é um número inteiro, não sendo necesário usar o interger.
    table.text("title");
    table.text("description");
    table.integer("rating");
    table.integer("user_id").references("id").inTable("users");
    // Cria uma coluna user_id que é uma chave estrangeira referenciando a coluna id na tabela users.
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
    // Cria colunas created_at e updated_at que armazenarão a data e a hora em que a linha foi criada e atualizada pela última vez, respectivamente. Este código define o valor padrão para a coluna em que é aplicado. knex.fn.now() é uma função que retorna a data e hora atuais. Portanto, sempre que uma nova linha é inserida na tabela, se nenhum valor for fornecido para essa coluna, ela será preenchida com a data e hora atuais.
  });

exports.down = (knex) => knex.schema.dropTable("notes");
// método down que define o que acontecerá quando a migração for revertida. Nesse caso, ele irá excluir a tabela notes.

// exports: No Node.js, exports é um objeto especial que é incluído em todos os módulos JS. Quando você usa exports, está tornando publicamente disponível qualquer coisa que anexar a ele. Então, exports.up e exports.down estão tornando as funções up e down disponíveis para serem usadas em outros lugares do seu aplicativo. Isso é necessário porque o Knex precisa ser capaz de executar essas funções quando você executa suas migrações.

// Quando você chama knex.schema, está chamando uma função específica fornecida pelo Knex que retorna um construtor de esquema. Este construtor de esquema tem métodos para criar, alterar e excluir tabelas, entre outras coisas. Portanto, você não pode simplesmente substituir schema por outro nome, pois isso quebraria a funcionalidade do seu código.
