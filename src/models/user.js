const { dbcon } = require("../config/connection-db");

class Usuario {
    constructor(id, nome, email, senha) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }
}

// DAO = DATA ACCESS OBJECT
class UsuarioDAO {

    static async cadastrar(usuario) {
          
        const sql = 'INSERT INTO public.usuario (nome, email, senha) VALUES ($1, $2, $3);';
        const values = [usuario.nome, usuario.email, usuario.senha];
        
        try {
            await dbcon.query(sql, values);
        } catch (error) {
            console.log('NÃO FOI POSSÍVEL INSERIR O USUÁRIO');
            console.log({ error });
        }
    }

    static async encontrarUsuario(email) {

        const sql = 'SELECT * FROM usuario where email = $1;';

        const result = await dbcon.query(sql, [email]);
        const usuario = result.rows[0];

        return usuario;

    }

}

module.exports = {
    Usuario,
    UsuarioDAO
};