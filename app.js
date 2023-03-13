// Carregando módulos
    const express = require("express");
    const app = express();
    const handlebars = require("express-handlebars");
    const bodyParser = require("body-parser");
    // const mongoose = require("mongoose");
    // mongoose.Promise = global.Promise;
    const admin = require("./routes/admin");

// Config

    // Body Parser
        app.use(bodyParser.urlencoded( {extended: true}));
        app.use(bodyParser.json());

    // Handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');

    // Mongoose



// Rotas 
    app.use('/admin', admin);


// Outros
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
})



