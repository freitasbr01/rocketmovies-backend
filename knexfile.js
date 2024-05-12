// Configurações para que o knex possa se conectar com o nosso banco de dados.

const path = require("path");

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, "src", "database", "database.db"),
    },
    pool: {
    afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb),
    }, // O comando PRAGMA foreign_keys = ON é para habilitar essa funcionalidade de deletar em cascata quando deletar uma nota.
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "knex", "migrations"),
    },
    useNullAsDefault: true,
    // É uma propriedade padrão para trabalharmos aqui com sqlite. Essa é uma configuração para tratar queries de inserção de dados em que você não tenha definido um valor e é específica para atender a uma exigência do SQL. Se você não setar essa propriedade, receberá o erro.
  },
};

// Temos um objeto chamado development e dentro desse objeto temos propriedades de configuração de conexão do knex com o nosso banco de dados. No client temos o tipo de banco de dados que vamos utilizar para se conectar com a nossa base de dados. Temos a conexão e lá dentro temos uma propriedade filename, nele precisamos dizer em que lugar está o meu arquivo do banco de dados.

// Ao invés de deixar o endereço cravado no filename para eu me previnir com a minha aplicação rodando em diversos sistemas operacionais, então vou usar o path para resolver para mim esse endereço

// AGORA QUE TEMOS O ARQUIVO COM AS CONFIGURAÇÕES, PRECISAMOS USAR ESSE ARQUIVO PARA QUE O KNEX POSSA ENTÃO SE CONECTAR COM A NOSSA BASE DE DADOS.

// A GENTE FEZ A ESTRATÉGIA DO MIGRATIONS NO SQLITE E VAMOS FAZER NO KNEX TAMBÉM PARA VERMOS. SERVE PARA AUTOMATIZAR TABELAS. Nessa situação para eu criar minha migrations eu não preciso criar um arquivo manualmente igual foi feito na migrations do sqlite, isso porque as migrations do knex vão ser gerenciadas pelo próprio knex. Digitamos então o comando " npx knex migrate:make createNotes "
