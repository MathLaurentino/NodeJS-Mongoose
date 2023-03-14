// Carregando módulos
    const express = require("express");
    const router = express.Router();
    const mongoose = require('mongoose');
    require("../modules/Categoria");
    const Categoria = mongoose.model('categorias');

// Rotas Admin

    /**
     * Rota para renderizar a página inicial do painel administrativo
     *
     * @param {Object} req - O objeto de solicitação HTTP
     * @param {Object} res - O objeto de resposta HTTP
     */
    router.get('/', (req, res) => {
        res.render("admin/index");
    });

    /**
    * Rota para renderizar a página de gerenciamento de posts do painel administrativo
    */
    router.get('/posts', (req, res) => {
        res.render("admin/index");
    });

    /**
     * Rota para renderizar a página de gerenciamento de categorias do painel administrativo
     */
    router.get('/categorias', (req, res) => {
        Categoria.find().lean().then((categorias) => {
            res.render("admin/categorias", {categorias: categorias});
        }).catch((err) => {
            req.flash("error_msg", "houve um erro ao listar as categorias");
            res.redirect("/admin");
        });
    });

    /**
     * Rota para renderizar a página de adição de categoria do painel administrativo
     */
    router.get('/categorias/add', (req, res) => {
        res.render("admin/addcategoria");
    });

    /**
     * Rota para adicionar uma nova categoria
     */
    router.post('/categorias/nova', (req, res) => {

        let erros = [];

        if (req.body.nome == "") {
            erros.push({texto: "Nome inválido"});
        }  
        
        if (req.body.slug == "") {
            erros.push({texto: "Slug inválido"});
        }

        if (req.body.nome.length < 2) {
            erros.push({texto: "Nome muito pequeno"});
        }

        if (erros.length > 0) {
            res.render("admin/addcategoria", {erro: erros});
        } else {
            const novaCategoria = {
                nome: req.body.nome,
                slug: req.body.slug
            }
            new Categoria(novaCategoria).save().then(() => {
                req.flash("success_msg", "Categoria criada com sucesso!")
                res.redirect("/admin/categorias");
            }).catch((err) => {
                req.flash("error_msg", "Erro ao salvar categoria!");
                res.redirect("/admin");
            })
        } 
    });

// Export
    module.exports = router;