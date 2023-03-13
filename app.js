// Carregando módulos
    const express = require("express");
    const app = express();
    const handlebars = require("express-handlebars");
    const bodyParser = require("body-parser");
    const path = require("path");
    const admin = require("./routes/admin");
    const mongoose = require("mongoose");
    

// Config

    // Body Parser
        app.use(bodyParser.urlencoded( {extended: true}));
        app.use(bodyParser.json());

    // Handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');

    // Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://127.0.0.1:27017/blogapp", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("Conexão com o MongoDB deu certo");
        }).catch((err) => {
            console.log("Conexão com MongoDB deu errado: " + err);
        })

    // Public
        app.use(express.static(path.join(__dirname, "public"))); /* os arquivos estáticos estão na pasta "public" */


// Rotas 
    app.use('/admin', admin);


// Outros
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
})



