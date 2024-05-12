// PARTE INTELIGENTE, FAZ O PROCESSAMENTO DAS REQUISIÇÕES

const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");
// const { response } = require("express");
// // O { response } la contém métodos e propriedades para manipular o conteúdo da resposta, como definir o status do código, enviar dados JSON, definir cabeçalhos, etc.

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const database = await sqliteConnection();
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if (checkUserExists) {
      throw new AppError("Este email já está em uso.")
    };

    const hashedPassword = await hash(password, 8);

    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    
    return response.status(201).json();
  }; // Cria um novo usuário na tabela users e no momento da criação verifica se o usuário já está cadastrado.

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    const database = await sqliteConnection();

    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

    if(!user) { // Se user for false, nulo, indefinido, lança o erro.
      throw new AppError("Usuário não encontrado.");
    }

    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);
    // A constante userWithUpdatedEmail armazenará o resultado da consulta ao banco de dados SQLite. Se um usuário com o mesmo endereço de e-mail já existir no banco de dados, o valor retornado será o do usuário existente. Caso contrário, se não houver um usuário com o mesmo e-mail, o valor será null.
     // Está realizando uma consulta ao banco de dados SQLite para buscar um usuário que tenha o valor de email igual ao fornecido.

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este email já está em uso.");
      // Verifica se o objeto userWithUpdatedEmail existe e se o id desse objeto é diferente do id do objeto user. Se ambas as condições forem verdadeiras, o bloco de código dentro das chaves {} será executado.
    }

    user.name = name ?? user.name; // Se existir conteúdo dentro de nome, ou seja, de name, ele que vai ser utilizado, se não existir o que vai ser utilizado vai ser o user.name, vai continuar o que já estava.
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError(
        "Você precisa informar a senha antiga para definir a nova senha."
      );
    }

    if(password && old_password) {
      const checkOldPassword =  await compare(old_password, user.password);
      // Se a variável password existe e a variável old_password também existe, então execute o bloco de código que segue, vou verificar se a senha antiga é igual a senha que está cadastrada no banco de dados. 
      // Verifica se a old_password corresponde à user.password do banco de dados usando a função compare e atribui o resultado à variável checkOldPassword.

      if(!checkOldPassword) {
        throw new AppError("A senha antiga não confere.");
      } // Se o que tiver aqui dentro for falso a senha antiga não confere.

      user.password = await hash(password, 8)
      // Se a senha bateu eu deixo atualizar. Faço a criptografia novamente.
    };

    await database.run(
      `
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    );
    // updated_at vai receber a função DATETIME('now') que é uma função do banco de dados.
    // Cada interrogação vai ser substituida por uma variavel que a gente tá passando nessa ordem.

    return response.status(200).json();
  } // Funcionalida de atualização do usuário.
};

module.exports = UsersController;