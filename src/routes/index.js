// O OBJETIVO DESSE ARQUIVO É REUNIR TODAS AS ROTAS DA APLICAÇÃO

const { Router } = require("express"); // Importando funcionalidade de rotas do express.

const usersRoutes = require("./users.routes"); // Importando rotas de usuário.
const notesRoutes = require("./notes.routes");
const tagsRouter = require("./tags.routes");
const sessionsRouter = require("./sessions.routes");

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRouter);
routes.use("/notes", notesRoutes);
routes.use("/tags", tagsRouter);

module.exports = routes;
