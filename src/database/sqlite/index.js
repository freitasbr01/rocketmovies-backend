// IMPORTANDO O SQLITE E FAZENDO A CONEXÃO COM O BANCO DE DADOS

const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const path = require("path");

async function sqliteConnection() {
  const database = await sqlite.open({
    filename: path.resolve(__dirname, "..", "database.db"),
    driver: sqlite3.Database,
  });

  return database;
};

// A instrução return database; na função sqliteConnection() não armazena o objeto de conexão com o banco de dados em nenhum local específico. Em vez disso, ela retorna esse objeto para quem chamou a função.
// A função sqliteConnection() não cria o banco de dados em si; ela apenas se conecta a um banco de dados existente.

module.exports = sqliteConnection;