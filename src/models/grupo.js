const { dbcon } = require("../config/connection-db");

class Grupo {
    constructor(id, nome) {
        this.id = id;
        this.nome = nome;
    }
}

// DAO = DATA ACCESS OBJECT
class GrupoDAO {

    static async cadastrar(grupo, usuario) {
        
        const sql = 'with rows as (INSERT INTO public.grupo (nome) VALUES ($1) RETURNING id) INSERT INTO public.grupo_usuario (grupo, usuario, tipo) SELECT id, $2, $3 FROM rows'
        const values = [grupo.nome, usuario.id, 'admin'];
        
        try {
            await dbcon.query(sql, values);
        } catch (error) {
            console.log({ error });
        }
    }

    static async encontrarTipo(grupo_id, usuario) {

        const sql = 'SELECT grupo_usuario.tipo FROM grupo_usuario JOIN usuario ON usuario.id = grupo_usuario.usuario JOIN grupo ON grupo.id = grupo_usuario.grupo WHERE usuario.email = $1 AND grupo.id = $2';
        const values = [usuario.email, grupo_id];

        const result = await dbcon.query(sql, values);
        const tipo = result.rows[0];

        return tipo;

    }

    static async encontrarGrupo(grupo_id) {
        const sql = 'SELECT * FROM grupo where id = $1';

        const result = await dbcon.query(sql, [grupo_id]);

        const grupo = result.rows[0];

        return grupo;
    }

    static async addMembro (email, tipo, grupo_id) {

        const select = 'SELECT * FROM usuario WHERE email = $1';

        const result = await dbcon.query(select, [email]);
        const usuario = result.rows[0];

        const insert = 'INSERT INTO public.grupo_usuario (grupo, usuario, tipo) VALUES ($1, $2, $3)';
        const values = [grupo_id, usuario.id, tipo];

        try {
            await dbcon.query(insert, values);
        } catch (error) {
            console.log({ error });
        }

    }

    static async delMembro (grupo_id, usuario_id) {

        const del = 'DELETE FROM public.grupo_usuario WHERE grupo = $1 AND usuario = $2';
        const values = [grupo_id, usuario_id];

        try {
            await dbcon.query(del, values);
        } catch (error) {
            console.log({ error });
        }

    }
}

module.exports = {
    Grupo,
    GrupoDAO
};