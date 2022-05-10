const { dbcon } = require('../config/connection-db');
const { Grupo, GrupoDAO } = require('../models/grupo');

class GruposController {
    async mostrarFormGrupo(req, res) {
        return res.render('form_grupo', { user: req.session.user })
    }

    async criarGrupo(req, res) {

        const { nome } = req.body;

        const usuario = {
            id: req.session.user.id,
            nome: req.session.user.nome,
            email: req.session.user.email,
            senha: req.session.user.senha
        }
        
        const grupo = new Grupo(null, nome);

        await GrupoDAO.cadastrar(grupo, usuario);
        
        return res.redirect('/');
    }

    async mostrarGrupo(req, res) {

        const { grupo_id } = req.params;

        const usuario = {
            id: req.session.user.id,
            nome: req.session.user.nome,
            email: req.session.user.email,
            senha: req.session.user.senha
        }

        const sql = 'SELECT grupo_usuario.id, usuario.id as usuario_id, usuario.nome as usuario, grupo.nome as grupo, grupo_usuario.tipo as cargo FROM grupo_usuario join grupo ON grupo.id = grupo_usuario.grupo join usuario ON usuario.id = grupo_usuario.usuario WHERE grupo.id = $1';

        const result1 = await dbcon.query(sql, [grupo_id]);

        const result2 = await GrupoDAO.encontrarTipo(grupo_id, usuario);

        const result3 = await GrupoDAO.encontrarGrupo(grupo_id);

        return res.render('pag_grupo', { user: req.session.user, grupos_usuarios: result1.rows, tipo: result2, grupo: result3 });
    }

    async mostrarFormMembro(req, res) {

        const { grupo_id } = req.params;

        const sql = 'SELECT * FROM grupo WHERE id = $1';

        const result = await dbcon.query(sql, [grupo_id]);

        return res.render('add_membro', { user: req.session.user, grupo: result.rows[0] });
    }

    async addMembro(req, res) {

        const { email, tipo } = req.body;

        const { grupo_id } = req.params;

        await GrupoDAO.addMembro(email, tipo, grupo_id);

        return res.redirect('/');

    }

    async delMembro(req, res) {

        const { grupo_id, user_id } = req.params;

        await GrupoDAO.delMembro(grupo_id, user_id);

        return res.redirect('/');

    }

    async listGrupos(req, res) {
        const result = await dbcon.query('SELECT grupo.id as id, grupo.nome as nome, count(*) as nmro_membros FROM grupo join grupo_usuario ON grupo_usuario.grupo = grupo.id GROUP BY grupo.id');

        return res.render('casa', { user: req.session.user, grupos: result.rows });
    }

    async gruposUser(req, res) {

        const { user_id } = req.params;

        const sql = 'SELECT grupo.id as id, grupo.nome as nome, nmro_membros.cont as nmro_membros FROM grupo JOIN grupo_usuario ON grupo_usuario.grupo = grupo.id JOIN (select grupo.id, count(*) as cont FROM grupo join grupo_usuario ON grupo_usuario.grupo = grupo.id GROUP BY grupo.id) as nmro_membros ON nmro_membros.id = grupo.id WHERE grupo_usuario.usuario = $1 GROUP BY grupo.id, nmro_membros.cont';

        const result = await dbcon.query(sql, [user_id]);

        return res.render('meus_grupos', { user: req.session.user, grupos: result.rows });
    }
}

module.exports = { GruposController }