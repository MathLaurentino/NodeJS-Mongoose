const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');

const usuarioController = require("../controllers/usuarioController");


router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
});


router.post('/registro', [
  check('nome').isLength({ min: 5 }).withMessage('Nome tem que ter 5 caracteres ou mais'),
  check('email').isEmail().withMessage('email inválido'),
  check('senha').isLength({ min: 8 }).withMessage('Senha tem que ter 8 caracteres ou mais')
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('usuarios/registro', { errors: errors.array() });
    } 

    else if (await usuarioController.findOneByEmail(req.body.email)){
        erros = [{msg: "email já cadastrado"}]
        return res.render('usuarios/registro', { errors: erros}); 
    } 
    
    else {
        usuarioController.createNewUser(req, res);
    }
  
});

module.exports = router;