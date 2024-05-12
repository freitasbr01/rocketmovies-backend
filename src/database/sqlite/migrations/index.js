// o código não cria o banco de dados SQLite, mas sim estabelece uma conexão com um banco de dados existente e executa os esquemas definidos no módulo createUsers

const sqliteConnection = require("../../sqlite");

const createUsers = require("./createUsers");

async function migrationsRun() {
  const schemas = [createUsers].join("");

  sqliteConnection() // promessa
  .then((db) => db.exec(schemas))
  .catch((error) => console.error(error));
}

module.exports = migrationsRun;