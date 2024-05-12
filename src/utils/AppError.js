// CRIA UM OBJETO DE ERRO PERSONALIZADO

class AppError {
  message;
  statusCode;
  // A finalidade de declarar as variáveis de instância message e statusCode na classe é para indicar que essas são as propriedades que cada instância da classe terá. Isso é uma forma de documentar o seu código e facilitar a leitura e a manutenção. No entanto, essa declaração não é obrigatória, e você poderia omiti-la sem alterar o funcionamento do seu código. 

  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
  // Está atribuindo o valor do parâmetro message à propriedade message da instância que está sendo criada.
}

module.exports = AppError;

// O construtor da classe AppError é chamado quando uma instância dessa classe é criada.
// O método construtor é carregado automáticamente quando a class é instânciada, toda vez que alguém for instânciar essa class eu quero saber do message e statusCode. O this dentro do constructor se refere a instância criada e não a class AppError em si.