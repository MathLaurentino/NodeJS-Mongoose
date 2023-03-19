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
    const passport = require("passport");
    require("./config/auth")(passport);

    const admin = require("./routes/admin"); // rotas admin
    const usuario = require("./routes/usuario"); // rotas usuario

    require("./models/Postagem");
    require("./models/Categoria");
    const Postagem = mongoose.model("postagens");
    const Categoria = mongoose.model("categorias");
    

// Config
    // Session
        /* Configuração da sessão */ 
        app.use(session({
            secret: "aprendendonodejs", // chave secreta utilizada para assinar o cookie de sessão e garantir que o usuário não possa alterar o seu valor.
            resave: true, // indica se a sessão deve ser regravada mesmo que não tenha sido modificada durante a requisição 
            saveUninitialized: true // indica se deve ser salvo uma sessão nova quando ela é criada, mesmo que ela ainda não tenha sido modificada.
        }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(flash()); // gerenciar mensagens de erro ou sucesso

    // Middleware 
        /* Middleware para mensagens de feedback ao usuário */
        app.use((req, res, next) => {

            res.locals.success_msg = req.flash("success_msg"); // mensagens de sucesso
            res.locals.error_msg = req.flash("error_msg"); // mensagens de erro

            res.locals.error = req.flash("error");

            /** armazenar dados so usuário logado
             *  req.user: o passport altomaticamente cria */
            res.locals.user = req.user || null;

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

    /* Rota para o painel de usuarios */
    app.use("/usuario", usuario);


    /**
     * @route GET /
     * Rota para renderizar a página inicial
     * Manda dados de todas as postagens com suas respectivas categorias
     */
    app.get("/", async (req,res) => {
        try {
            const postagens = await Postagem.find().lean().populate("categoria").sort({data: 'desc'});
            res.render("index", {postagens: postagens});
        } catch (err) {
            req.flash("error_msg", "Não foi possível carregar os posts")
            res.redirect("/404")
        } 
    });


    /**
     * @route GET /
     * Rota para renderizar a página de uma postagem expecífica
     * Mandado todos os dados da postagem para a view
     */
    app.get("/postagem/:slug", (req, res) => {
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
            if (postagem){
                res.render("postagem/postagem", {postagem: postagem});
            } else {
                req.flash("error_msg", "Esta postagem não existe");
                res.redirect("/");
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno");
            res.redirect("/");
        })
    });


    /**
     * @route GET /
     * Rota para renderizar a página das categorias do site
     * Exibe todas as categorias na view
     */
    app.get("/categorias", async (req, res) => {
        try {
            const categorias = await Categoria.find().lean();
            res.render("categorias/categorias", {categorias: categorias});
        } catch (err) {
            req.flash("error_msg", "Houve um erro interno");
            res.redirect("/");
        }
    });


    /**
     * @route GET /
     * Rota para renderizar a página que exibe as postagens de uma categoria expecífica
     * Manda um arrei com todas as postaegns de uma categoria expecífica para a view
     */
    app.get("/categorias/:slug", async (req, res) => {
        try {
            const categoria = await Categoria.findOne({slug: req.params.slug}).lean();

            if (categoria) {
                const postagens = await Postagem.find({categoria: categoria._id}).lean();
                res.render("categorias/postagens", ({postagens: postagens, categoria: categoria}));
            } else {
                req.flash("error_msg", "categoria não encontrada");
                res.redirect("/categorias");
            }

        } catch (err) {
            req.flash("error_msg", "Houve um erro enterno");
            res.redirect("/categorias");
        }
    });


    /**
     * @route GET /
     * Rota para renderizar a página de erro
     */
    app.get("/404", (req, res) => {
        res.send("Erro 404");
    });


// Outros
    /* Inicialização do servidor na porta 3000 */
    app.listen(3000, () => {
        console.log("Servidor rodando na porta 3000");
    });



