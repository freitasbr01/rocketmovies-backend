// TODAS AS ROTAS DE TAGS FICARÃO AQUIA.

const { Router } = require("express");
const TagsController = require("../controllers/TagsController");

const tagsRoutes = Router();
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const tagsController = new TagsController();

tagsRoutes.get("/", ensureAuthenticated, tagsController.index);

module.exports = tagsRoutes;