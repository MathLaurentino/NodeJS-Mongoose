// Carregando módulos
    /**
     * @file Arquivo principal da aplicação Node.js para o blogapp
     */
    const express = require("express");
    const app = express();
    const handlebars = require("express-handlebars"); //motor de visualização de páginas
    const bodyParser = require("body-parser"); // processamento de formulários
    const mongoose = require("mongoose"); // conexão com o mongoDB
    const session = require("express-session"); // criação de sessão do usuário
    const flash = require("connect-flash"); // mensagens flash (só aparecem uma vez)
    const path = require("path"); // vem com o nodeJS
    const admin = require("./routes/admin"); // rotas admin
    

// Config
    // Session
        /* Configuração da sessão */ 
        app.use(session({
            secret: "aprendendonodejs", // chave secreta utilizada para assinar o cookie de sessão e garantir que o usuário não possa alterar o seu valor.
            resave: true, // indica se a sessão deve ser regravada mesmo que não tenha sido modificada durante a requisição 
            saveUninitialized: true // indica se deve ser salvo uma sessão nova quando ela é criada, mesmo que ela ainda não tenha sido modificada.
        }));
        app.use(flash()); // gerenciar mensagens de erro ou sucesso

    // Middleware 
        /* Middleware para mensagens de feedback ao usuário */
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg");
            res.locals.error_msg = req.flash("error_msg");
            next();
        });

    // Body Parser
        /* Configuração do body-parser para processamento de formulários */
        app.use(bodyParser.urlencoded( {extended: true}));
        app.use(bodyParser.json());

    // Handlebars
        /* Configuração do Handlebars como motor de visualização de páginas */
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');

    // Mongoose
        /* Configuração do Mongoose para conexão com o banco de dados MongoDB */
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://127.0.0.1:27017/blogapp", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("Conexão com o MongoDB deu certo");
        }).catch((err) => {
            console.log("Conexão com MongoDB deu errado: " + err);
        });

    // Public
        /* Configuração da pasta de arquivos estáticos;
           Os arquivos estáticos estão na pasta "public" */
        app.use(express.static(path.join(__dirname, "public"))); 


// Rotas 
    /* Rota para o painel de administração */
    app.use('/admin', admin);


// Outros
    /* Inicialização do servidor na porta 3000 */
    app.listen(3000, () => {
        console.log("Servidor rodando na porta 3000");
    });



