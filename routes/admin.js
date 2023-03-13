const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
require("../modules/Categoria");
const Categoria = mongoose.model('categorias');

router.get('/', (req, res) => {
    res.render("admin/index");
});

router.get('/posts', (req, res) => {
    res.render("admin/index");
});

router.get('/categorias', (req, res) => {
    res.render("admin/categorias");
});

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategoria");
});

router.post('/categorias/nova', (req, res) => {
    const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }
    new Categoria(novaCategoria).save().then(() => {
        console.log("categoria salva com sucesso");
        res.redirect("/admin/categorias");
    }).catch((err) => {
        console.log("Erro ao salvar usuário: " + err);
    })
})

module.exports = router;