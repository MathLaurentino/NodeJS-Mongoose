// Carregando módulos
    /**
     * @file Arquivo principal da aplicação Node.js para o blogapp
     */
    const express = require("express");
    const app = express();
    const handlebars = require("express-handlebars");
    const bodyParser = require("body-parser");
    const path = require("path");
    const admin = require("./routes/admin");
    const mongoose = require("mongoose");
    const session = require("express-session");
    const flash = require("connect-flash");
    

// Config
    // Session
        /* Configuração da sessão */ 
        app.use(session({
            secret: "aprendendonodejs",
            resave: true,
            saveUninitialized: true 
        }));
        app.use(flash());

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



