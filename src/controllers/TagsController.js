const knex = require("../database/knex");

class TagsController {
  async index(request, response) {
    const user_id = request.user.id;

    const tags = await knex("tags").where({ user_id })
    // Consulta a tabela “tags” em um banco de dados, filtre todas as linhas da tabela “tags” onde a coluna “user_id” corresponde ao valor de user_id fornecido e o resultado vai ser um (array de linhas correspondentes) é atribuído à variável tags.
    .groupBy("name");

    return response.json(tags);
  }
} // Listando as tags.

module.exports = TagsController;