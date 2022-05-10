const bcrypt = require('bcrypt');
const { dbcon } = require('../config/connection-db');
const { Usuario, UsuarioDAO } = require('../models/user');

class UsersController {

    async cadastrar(req, res) {

        const userBody = req.body;
        const senha = bcrypt.hashSync(userBody.senha, 10); 
        
        const user = {
            nome: userBody.nome,
            email: userBody.email,
            senha: senha      
        }
        
        const usuario = new Usuario(null, user.nome, user.email, user.senha);
        await UsuarioDAO.cadastrar(usuario);
        
        req.session.user = usuario;
        return res.redirect('/');

    }

    async login(req, res) {

        const { email, senha } = req.body;

        const usuario = await UsuarioDAO.encontrarUsuario(email);

        if (usuario === undefined) {
            return res.send('Usuário não está cadastrado ao sistema <br><br> <a href="/">Voltar à página inicial</a>');
        }

        const confere = bcrypt.compareSync(senha, usuario.senha);
        if (confere) {
            req.session.user = usuario;
            return res.redirect('/');
        } else {
            return res.send('Senha incorreta... <br><br> <a href="/">Voltar à página inicial</a>');
        }
        
    }

    async mostraLogin(req, res) {
        return res.render('user_login', {user : undefined});
    }

    async mostraCadastro(req, res) {
        return res.render('user_cadastro', {user : undefined});
    }

    async logout(req, res) {
        req.session.destroy();

        return res.redirect('/');
    }
}

module.exports = UsersController; 