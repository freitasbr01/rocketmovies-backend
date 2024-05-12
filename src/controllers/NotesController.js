// PARTE DO CONTROLADOR EM NODE.JS QUE USA O KNEX PARA INTERAGIR COM O BANCO DE DADOS.

const knex = require("../database/knex") // Importando a minha conexão do knex com o banco de dados.

class NotesController {
  async create(request, response) {
    const { title, description, rating, tags } = request.body;
    const user_id = request.user.id;

    const [note_id] = await knex("notes").insert({ title, description, rating, user_id, });
    // Uma nota é inserida na tabela “notes” usando o knex. O note_id é extraído do resultado dessa inserção.
    // Insere uma nova nota com o título, descrição, rating e ID do usuário na tabela notes do banco de dados.
    // Vou armazenar na constante note_id qual o id da nota que eu acabei de cadastrar.

    const tagsInsert = tags.map((name) => {
      return {
        note_id,
        name, // o valor de name é o nome da tag original.
        user_id,
      };
    });
    // A função map é usada para criar um novo array chamado tagsInsert. Para cada elemento no array tags, um objeto é criado com as propriedades note_id, name e user_id. O note_id é o mesmo valor obtido na etapa anterior (ou seja, o ID da nota recém-inserida). O name é o nome da tag. O user_id é o ID do usuário associado à nota. O código está vinculando cada tag à nota recém-criada, usando o mesmo note_id. No final, obtemos uma nova array de objetos (tagsInsert), contendo exatamente a mesma quantidade de elementos que temos na array tags.
    // O parâmetro name é um placeholder que representa cada elemento do array tags durante cada iteração.

    await knex("tags").insert(tagsInsert);
    // Não está criando uma tabela de tags. Ele está inserindo novos registros na tabela tags que já existe no banco de dados. Insere todos os objetos de tag na tabela tags do banco de dados.

    return response.json();
  } // Cadastrando notas e associando e tags, (não é o mesmo que criar tabela de notas).

  async show(request, response) {
    const { id } = request.params;

    const note = await knex("notes").where({ id }).first();
    // Essa linha de código consulta a tabela “notes” no banco de dados, filtra as linhas com base no parâmetro id fornecido e recupera a primeira linha correspondente (se houver) para armazená-la na variável “note”.

    const tags = await knex("tags").where({ note_id: id }).orderBy("name");
    // Ele filtra as linhas onde o valor na coluna “note_id” corresponde ao valor da variável “id”. Isso efetivamente associa as tags a uma nota específica (identificada pelo seu ID).
    // O método .orderBy("name") ordena as linhas filtradas em ordem alfabética com base na coluna “name”.

    return response.json({ ...note, tags });
  } // Exibi uma nota especifica.
  // A função “show” recupera uma única nota de uma tabela de banco de dados com base no parâmetro id fornecido e responde com a nota recuperada em formato JSON.

  async delete(request, response) {
    const { id } = request.params;

    await knex("notes").where({ id }).delete();

    return response.json();
  } // Deletando uma nota especifica.

  async index(request, response) {
    const { title, tags } = request.query;
    const user_id = request.user.id;
    // As propriedades title, user_id e tags são parâmetros da requisição, são extraídas do objeto request.query. Eles são usados para determinar que tipo de consulta será executada e quais dados serão buscados do banco de dados.

    let notes;
    // Inicializamos uma variável chamada notes que será usada para armazenar as notas recuperadas.

    if(tags) {
      // Se tags estiver presente na consulta, a função buscará notas que correspondam a essas tags. Caso contrário, ele buscará notas apenas com base no title e user_id, (else).
      const filterTags = tags.split(",").map((tag) => tag.trim());
       // Divide as tags separadas por vírgula em um array e remove os espaços em branco usando o método map.
      notes = await knex("tags")
       // o knex("tags") foi colocado aqui para operações um pouco mais a frente.
      .select(["notes.id", "notes.title", "notes.user_id"])
       // Aqui independe ter colocado o knex("tags") ou não. Você está selecionando colunas que está na tabela “notes”. Isso é comum quando você está fazendo uma operação de junção (join) entre duas tabelas. Nesse caso, você estaria selecionando colunas da tabela “notes” que estão relacionadas de alguma forma com a tabela “tags”.
      .where("notes.user_id", user_id)
        // Filtra as notas onde o user_id associado à nota é igual ao user_id fornecido.
      .whereLike("notes.title", `%${title}%`)
        // Filtra as notas onde o title associado à nota é igual ao title fornecido. Esta linha filtra as notas em que o “título” contém a substring fornecida. O % significa o que vem antes ou depois.
      .whereIn("name", filterTags)
        // Filtra todas as linhas que têm qualquer um dos nomes especificados no array filterTags.
      .innerJoin("notes", "notes.id", "tags.note_id")
        // Junção interna com a tabela “notes”. Esta linha realiza uma junção interna entre as tabelas “tags” e “notes”.
        // "notes" e "tags" são os nomes das tabelas envolvidas na junção. "notes.id" se refere à coluna “id” na tabela “notes”. "tags.note_id" se refere à coluna “note_id” na tabela “tags”.
      .groupBy("notes.id")       
      .orderBy("notes.title")
        // Ordena os resultados pelo título da nota. Esta linha classifica as notas resultantes pelo seu “título” em ordem ascendente.

    } else { // Caso contrário, ele buscará notas apenas com base no title e user_id, (else).
      notes = await knex("notes")
      .where({ user_id })
      // Filtra as notas onde o user_id associado à nota é igual ao user_id fornecido.
      .whereLike("title", `%${title}%`)
      // Filtra as notas onde o title associado à nota é igual ao title fornecido.      
      .orderBy("title");
    } 
    // Em resumo, esta função serve para buscar notas de um banco de dados com base no title, user_id e tags fornecidos na consulta do usuário. Se tags estiver presente na consulta, a função buscará notas que correspondam a essas tags. Caso contrário, ele buscará notas apenas com base no title e user_id.

    const userTags = await knex("tags").where({ user_id });
    // Filtra as tags onde o user_id associado a tag é igual ao user_id fornecido.
    // Ele recupera todas as tags associadas a um usuário específico. Obtendo tags da nota.
    const notesWithTags = notes.map(note => {
    // Essa parte do código irá pegar a variável notes que foi definida um pouco mais acima contendo as notas e fará um .map(percorrer cada item executando uma função/condição).
    const noteTags = userTags.filter(tag => tag.note_id === note.id);
    // Essa parte do código irá filtrar o array userTags (que contém todas as tags como expliquei mais acima) e retornará apenas os que satisfazem a condição do parêntese, ou seja, todas as tags em que o note_id seja igual ao note.id.      
      return {
        ...note,
        tags: noteTags
      }
      
    });
    // O código return { ...notes, tags: noteTags } está retornando um novo objeto que contém todas as informações da nota atual (representada por ...notes) e adiciona a propriedade tags, que é um array das tags correspondentes à nota atual (representada por noteTags). Aqui, ...notes é a sintaxe de espalhamento do JavaScript, que é usada para copiar as propriedades enumeráveis de um objeto para outro. Nesse caso, está copiando todas as propriedades da nota atual para o novo objeto. Então, em resumo, para cada nota, o código está criando um novo objeto que contém todas as informações da nota, além de suas tags correspondentes.

    return response.json(notesWithTags);
  } // Lista todas as notas cadastradas.
  // Nessa rota também aprendemos a utilizar parâmetros para fazer filtro de pesquisa, no Insomnia conseguimos colocar esses parâmetros.
}

module.exports = NotesController;