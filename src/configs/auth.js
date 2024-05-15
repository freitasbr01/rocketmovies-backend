
module.exports = {
  jwt: {
    secret: process.env.AUTH_SECRET || "default",
    expiresIn: "1d"
  }
}

// Ou coloca a variavel de ambiente ou seta o default


