const config = require("../../../knexfile"); // Importando o arquivo de configurações knexfile.js
const knex = require("knex"); // Importando o knex.

const connection = knex(config.development);
// Agora vou criar a minha conexão, vou falar que é uma conexão knex e para o knex vou passar quais as configurações de conexão, então dentro do meu config temos as configurações de desenvolvimento.

module.exports = connection;
// Vou exportar a minha conexão do knex com o banco de dados para ser utilizada em outros lugares.