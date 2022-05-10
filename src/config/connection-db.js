const { Client } = require('pg')

const dbcon = new Client({
    connectionString: 'postgres://rxccrybfllkdln:27b135f1e21e186f318d201c22e0ec39c9168630fb7c1a1cd8a2508911403892@ec2-52-4-104-184.compute-1.amazonaws.com:5432/ddmqafj9in6qot',
    ssl: {
        rejectUnauthorized: false
    }
});

dbcon.connect(err => {
    if (err) {
        console.log("ERRO!!! NÃO FOI POSSÍVEL SE CONECTAR AO BANCO");
        console.log( { err });
    } else {
        console.log("CONEXÃO COM O BANCO BEM SUCEDIDADA");
    }
});

module.exports = {
    dbcon
}