

/**      function verifyData(nome, slug)
 *  Verifica se os dados fornecidos são válidos.
 *  @param {string} nome - O nome a ser verificado.
 *  @param {string} slug - O slug a ser verificado.
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

    return erros;
}

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

module.exports = {
    verifyCategoria,
    verifyPostagem
}