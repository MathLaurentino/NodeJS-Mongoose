/**
 * @param {array} reqBody contem as informações do form ADD/EDIT postagem 
 * @returns {array} contendo as informações do form tratadas e com os erros da verifyPostagem
 */
function limparEValidarPostagem(reqBody) {
    let {titulo, slug, descricao, conteudo, categoria} = reqBody;
    titulo = titulo.trim();
    slug = slug.trim();
    descricao = descricao.trim();
    conteudo = conteudo.trim();
    categoria = categoria.trim();

    const erro = verifyPostagem(titulo, slug, descricao, conteudo, categoria);
    return {titulo, slug, descricao, conteudo, categoria, erro};
}


/**      function verifyPostagem(titulo, slug, descricao, conteudo, categoria)
 *  Verifica se os dados fornecidos são válidos.
 *  @returns {Array} - Uma matriz de objetos de erro contendo mensagens de erro, caso existam.
 */
function verifyPostagem(titulo, slug, descricao, conteudo, categoria)
{
    let erros = [];

    if (titulo == "" || titulo.length < 2) {
        erros.push({texto: "Título muito curto"});
    }  
    
    if (slug == "" || slug.length < 2) {
        erros.push({texto: "Slug muito curto"});
    }

    if (descricao == "" || descricao.length < 2) {
        erros.push({texto: "Descricao muito curta"});
    }

    if (conteudo == "" || conteudo.length < 2) {
        erros.push({texto: "Conteudo muito curta"});
    }

    if (categoria == 0) {
        erros.push({texto: "Selecione uma categoria"});
    }

    return erros;
}

module.exports = { limparEValidarPostagem };