/**
 * @param {array} reqBody contem as informações do form ADD/EDIT postagem 
 * @returns {array} contendo as informações do form tratadas e com os erros da verifyPostagem
 */
function limparEValidarCategoria(reqBody) {
    let {nome, slug} = reqBody;
    nome = nome.trim();
    slug = slug.trim();

    const erro = verifyCategoria(nome, slug);
    return {nome, slug, erro};
}



/**      function verifyData(nome, slug)
 *  Verifica se os dados fornecidos são válidos.
 *  @returns {Array} - Uma matriz de objetos de erro contendo mensagens de erro, caso existam.
 */
function verifyCategoria(nome, slug)
{
    let erros = [];

    if (nome == "") {
        erros.push({texto: "Nome inválido"});
    }  
    
    if (slug == "") {
        erros.push({texto: "Slug inválido"});
    }

    if (nome.length < 2) {
        erros.push({texto: "Nome muito pequeno"});
    }

    if (slug.length < 2) {
        erros.push({texto: "Slug muito pequeno"});
    }

    return erros;
}

module.exports = { limparEValidarCategoria };