const { Router } = require('express');
const UsersController = require('../controllers/users-controllers');

const routes = Router();

const usersController = new UsersController();

routes.get('/user_cadastro', usersController.mostraCadastro);

routes.get('/user_login', usersController.mostraLogin);

routes.post('/cadastrar', usersController.cadastrar);

routes.post('/login', usersController.login);

routes.get('/logout', usersController.logout);

module.exports = routes;