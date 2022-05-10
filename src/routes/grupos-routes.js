const { Router } = require('express');
const { GruposController } = require('../controllers/grupos-controllers');

const routes = Router();

const gruposController = new GruposController();

routes.get('/form_grupo', gruposController.mostrarFormGrupo);

routes.get('/', gruposController.listGrupos);

routes.post('/criar_grupo', gruposController.criarGrupo);

routes.get('/:grupo_id/addMembro', gruposController.mostrarFormMembro);

routes.post('/:grupo_id/addMembro', gruposController.addMembro);

routes.get('/:grupo_id', gruposController.mostrarGrupo);

routes.get('/:grupo_id/removerMembro/:user_id', gruposController.delMembro);

routes.get('/meus_grupos/:user_id', gruposController.gruposUser);

module.exports = routes;