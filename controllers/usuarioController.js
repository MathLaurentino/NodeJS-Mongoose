const mongoose = require("mongoose"); // conexão com o mongoDB
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");
const bcrypt = require("bcryptjs");

exports.findOneByEmail = async (email) => {
    const usuario = await Usuario.findOne({email: email}).lean();
    if (usuario) {
        return true;
    } else {
        return false;
    }
}

exports.createNewUser = async (req, res) => {

    bcrypt.hash(req.body.senha, 10, function(err, hash) {

        if (err) {
            req.flash("error_msg", "Houve um errou ao salvar usuário")
            res.redirect("/")
        }

        const novoUSuario = new Usuario({
            nome: req.body.nome,
            email: req.body.email,
            senha: hash
        });
    
        novoUSuario.save().then(() => {
            req.flash("success_msg", "Usuário cadastrado com sucesso");
            res.redirect("/")
        }).catch((err) => {
            req.flash("error_msg", "Houve um errou ao salvar usuário")
            res.redirect("/")
        });
    });
}

