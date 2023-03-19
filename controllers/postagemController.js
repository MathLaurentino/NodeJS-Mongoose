const mongoose = require("mongoose"); // conexão com o mongoDB
require("../models/Postagem");
const Postagem = mongoose.model("postagens");

/**
 * @returns {array} array com todas as postagens juntamente com sua respectivas categorias
 */
exports.getAllPosts = async () => {
    // buscar todos os clientes no banco de dados
    const postagens = await Postagem.find().lean().populate("categoria").sort({data:'desc'});
    // retornar os clientes para serem renderizados na view
    return { postagens };
};