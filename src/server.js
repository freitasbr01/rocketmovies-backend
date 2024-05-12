// INICIALIZA A APLICAÇÃO

require("express-async-errors");
const migrationsRun = require("./database/sqlite/migrations");
const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/upload");

const cors = require("cors");
const express = require("express");
const routes = require("./routes");

migrationsRun();
// Vai executar meu banco de dados. Toda vez que iniciamos o banco de dados pela primeira vez, se o arquivo do banco de dados não existe ele cria o arquivo pra gente.

const app = express(); // Nova instância de express.
app.use(cors()); // Vai habilitar para que o backend consiga atender as requisições do frontend.
app.use(express.json()); // Configurando a instância criada para entender json.

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);
// Quando a requisição é feita ele vem para o server.js e diz para usar essas rotas.

app.use((error, request, response, next) => {
  if(error instanceof AppError) {
  // se o error for uma instância da class AppError (lado cliente) retorna o statusCode e mensagem abaixo.

    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    }); 
    // error lado cliente.

  };
  // Em resumo, esse middleware trata erros personalizados da sua aplicação e envia uma resposta adequada com base no tipo de erro encontrado. O return garante que a execução do middleware seja interrompida após o envio da resposta.
  // O "error" é para capturarmos o erro da requisição. O "request" é a requisição em si, não estamos usando aqui. O "response" é para devolvermos a resposta. O "next" é caso queira pedir para ele avançar para uma próxima etapa.

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internal server error."
  })
  // error lado servidor.

});

const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));