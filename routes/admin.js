// Carregando módulos
    const express = require("express");
    const router = express.Router();
    const mongoose = require('mongoose');

    const postagemUtils = require('../utils/postagem');
    const categoriaUtils = require('../utils/categoria');
    const postController = require('../controllers/postagemController');
    const {eAdmin} = require("../utils/eAdmin");

    require("../models/Categoria");
    require("../models/Postagem");
    const Categoria = mongoose.model('categorias');
    const Postagem = mongoose.model('postagens');
    
// Rotas Admin

    /**     
     * @route GET /
     * Rota para renderizar a página inicial do painel administrativo
     * @param {Object} req - O objeto de solicitação HTTP
     * @param {Object} res - O objeto de resposta HTTP
     */
    router.get('/', eAdmin, (req, res) => {
        res.render("admin/index");
    });


    // -----------


    /**     
     * @route GET /categorias
     * Rota para renderizar a página de gerenciamento de categorias do painel administrativo
     */
    router.get('/categorias', eAdmin, async (req, res) => {
        try{
            const categorias = await Categoria.find().lean();
            res.render("admin/categorias", {categorias: categorias});
        } catch (err) {
            req.flash("error_msg", "houve um erro ao listar as categorias");
            res.redirect("/admin");
        }
            
    });


    router.get("/categorias/add", eAdmin, (req, res) => {
        res.render("admin/addcategoria");
    })


    /**     
     * @route POST /categorias/add
     * Rota para adicionar uma nova categoria
     */
    router.post('/categorias/add', eAdmin, async (req, res) => {
        try {
            const {nome, slug, erro} = categoriaUtils.limparEValidarCategoria(req.body);

            if (erro.length > 0) {
                res.render("admin/addcategoria", { erro: erro });
                return;
            }

            const novaCategoria = new Categoria({ nome, slug });
            await novaCategoria.validate();
            await novaCategoria.save();

            req.flash("success_msg", "Categoria criada com sucesso!");
            res.redirect("/admin/categorias");
        } catch (err) {
            req.flash("error_msg", "Erro ao salvar categoria!");
            res.redirect("/admin/categorias/add");
        }
    });

    
    // -----------


    /**     
     * @route GET /categorias/adit/:id
     * Rota para renderizar a página de edição de categoria do painel administrativo
     */
    router.get("/categorias/adit/:id", eAdmin, async (req, res) => {
        try{
            const categoria = await Categoria.findOne({_id: req.params.id}).lean();
            res.render("admin/editcategorias", {categoria: categoria});
        }catch (err) {
            req.flash("error_msg", "Essa categoria não existe");
            res.redirect("/admin/categorias");
        }
    });


    /**     
     * @route POST /categorias/edit
     * Rota para editar uma categoria
     */
    router.post("/categorias/edit", eAdmin, async (req, res) => {
        try {
            const {nome, slug, erro} = categoriaUtils.limparEValidarCategoria(req.body);
            if (erro.length > 0) {
                const categoria = await Categoria.findById(req.body.id).lean();
                res.render("admin/editcategorias", {erro: erro, categoria: categoria});
                return;
            }

            const editCategoria = await Categoria.findById(req.body.id);
            editCategoria.nome = nome;
            editCategoria.slug = slug;
            editCategoria.save();

            req.flash("success_msg", "categoria editada com sucesso");
            res.redirect("/admin/categorias")

        } catch (err) {
            req.flash("error_msg", "Houve um erro ao editar a categoria");
            res.redirect("/admin/categorias");
        }
    });


    // -----------


    /**     
     * @route GET /categorias/deletar
     * Rota para apagar uma categoria
     */
    router.get("/categorias/deletar/:id", eAdmin, (req, res) => {
        Categoria.deleteOne({_id: req.params.id }).then(() => {
            req.flash("success_msg", "Categoria deletada com sucesso");
        }).catch((err) => {
            req.flash("error_msg", "Falha ao deletar categoria");
        });      
        res.redirect("/admin/categorias");  
    });


    // ----------- POSATGENS -----------


    // -----------

    /**     
     * @route GET /postagens
     * Rota para renderizar a página de postagens do painel administrativo
     */
    router.get('/postagens', eAdmin, async (req, res) => {
        try {
            // aprendendo a utilizar controllers, depois irei refatorar o resto do código
            const { postagens } = await postController.getAllPosts();
            res.render('admin/postagens', { postagens });
        } catch (err) {
            req.flash("error_msg", "Erro ao listar postagens");
            res.redirect("/admin",);
        }
      });

    // -----------


    /**     
     * @route GET /postagens/add
     * Rota para renderizar a página de adição de postagens do painel administrativo
     */
    router.get("/postagens/add", eAdmin, async (req, res) => {
        try {
            const categorias = await Categoria.find().lean();
            res.render("admin/addPostagem", { categorias });
        } catch (err) {
            req.flash("error_msg", "Houve um erro ao carregar o formulário");
            res.redirect("/admin/postagens");
        }
    });


    /**     
     * @route POST /postagens/add
     * Rota para adicionar uma categoria
     */
    router.post("/postagens/add", eAdmin, async (req, res) => {

        try{
            const {titulo, slug, descricao, conteudo, categoria, erro} = postagemUtils.limparEValidarPostagem(req.body);

            if (erro.length > 0) {
                const categorias = await Categoria.find().lean();
                res.render("admin/addPostagem", {categorias: categorias, erro: erro});
                return;
            }

            const novaPostagem = new Postagem({titulo, slug, descricao, conteudo, categoria});
            await novaPostagem.validate();
            await novaPostagem.save();

            req.flash("success_msg", "Postagem criada com sucesso!");
            res.redirect("/admin/postagens");

        } catch (err) {
            req.flash("error_msg", "Falha ao criar postagem!");
            res.redirect("/admin/postagens");
        }
        
    });

    
    // -----------


    /**
     * @route GET /postagem/edit/:id
     * Busca uma postagem específica no banco de dados pelo ID e renderiza a página de edição de postagem,
     * passando a postagem encontrada e as categorias disponíveis para a view.
     */
    router.get("/postagem/edit/:id", eAdmin, async (req, res) => {
        try {
            const postagem = await Postagem.findOne({_id: req.params.id}).lean();
            const categorias = await Categoria.find().lean();
            res.render("admin/editPostagem", {postagem: postagem, categorias: categorias});
        } catch (err) {
            req.flash("error_msg", "Falha ao identificar postagem!");
            res.redirect("/admin/postagens");
        }
    });

    
    /**
     * @route POST /postagem/edit
     * Atualiza uma postagem existente no banco de dados com os dados enviados pelo usuário na requisição.
     */
    router.post("/postagem/edit", eAdmin, async (req, res) => {

        try{
            const {titulo, slug, descricao, conteudo, categoria, erro} = postagemUtils.limparEValidarPostagem(req.body);

            if (erro.length > 0) {
                const postagem = await Postagem.findById(req.body.id).lean();
                const categorias = await Categoria.find().lean();
                res.render("admin/editPostagem", ({postagem: postagem, categorias: categorias, erro: erro}))
                return;
            }

            const editPostagem = await Postagem.findOne({_id: req.body.id});
            editPostagem.titulo = titulo;
            editPostagem.slug = slug;
            editPostagem.descricao = descricao;
            editPostagem.conteudo = conteudo;
            editPostagem.categoria = categoria;

            await editPostagem.save();

            req.flash("success_msg", "Postagem editada com sucesso");
            res.redirect("/admin/postagens");
        }catch (err) {
            req.flash("error_msg", "Houve um erro ao editar a postagem");
            res.redirect("/admin/postagens");
        }
    });


    /**
     * @route GET /postagem/deletar/:id
     * Deleta uma postagem específica do banco de dados pelo ID e redireciona o usuário para a página de gerenciamento
     * de postagens.
     */
    router.get("/postagem/deletar/:id", eAdmin, (req, res) => {
        
        Postagem.deleteOne({_id: req.params.id }).then(() => {
            req.flash("success_msg", "Postagem deletada com sucesso");
        }).catch((err) => {
            req.flash("error_msg", "Falha ao deletar categoria");
        });      
        
        res.redirect("/admin/postagens");  
    });

// Export
    module.exports = router;