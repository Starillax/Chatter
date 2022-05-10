const express = require('express');
const app = express();
const session = require('express-session');

app.set('view engine', 'ejs');
app.set('views', './src/view');

app.use(express.urlencoded({
    extended: true,
}));

app.use(express.json());

app.use(session({
    secret: 'chave secreta de criptografia',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

app.use(express.static('public'));

app.use('*', (req, res, next) => {
    next();
})

app.get('/', (req, res) => {
    res.redirect('/grupos');
});

const usersRoutes = require('./routes/users-routes');
app.use('/users', usersRoutes);

const gruposRoutes = require('./routes/grupos-routes');
app.use('/grupos', gruposRoutes);

app.use('*', (req, res) => {
    return res.status(404).send(`
        <h1>Sorry, not found!!!</h1>
        <a href="/">VOLTAR</a>
    `);
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server iniciado na porta ${PORT}`)
});
