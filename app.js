const express = require('express');
const mongoose = require('mongoose');

require('./models/Usuarios');
const Usuarios = mongoose.model('usuarios');

const app = express();
app.use(express.json());

/*app.use((req,res,next)=>{
    console.log("Acessou o Middlewares");
    next();
})*/

function ValidarUsuarios(req,res,next){
    if (!req.body.nome){
        return res.status(400).json({
            error: "O campo nome é obrigatório"
        })
    }
    if (!req.body.email){
        return res.status(400).json({
            error: "O campo email é obrigatório"
        })
    }
    return next();
}


mongoose.connect('mongodb://localhost/rafael', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => {
    console.log("Conexão com MongoDB realizada com sucesso!");
}).catch((erro) =>{
    console.log("Erro: Conexão com MongoDB não foi realizada com sucesso!",erro);
});    

app.get("/usuarios",(req, res)=>{
    Usuarios.find({}).then((usuarios) =>{
        return res.json(usuarios);

    }).catch((err) => {
        return res.status(400).json({
            error: true,
            message: "Nenhum usuário encontrado!"
        });
    });

});

app.get("/usuarios/:id", (req, res) => {
    Usuarios.findOne({ _id: req.params.id}).then((usuario)=>{
        return res.json(usuario);
    }).catch((err)=>{
        return res.status(400).json({
            error: true,
            message: "Erro: Nenhum usuário encontrado!"
        });
    });
});

app.put("/usuarios/:id",ValidarUsuarios,(req, res) => {
    Usuarios.updateOne({ _id: req.params.id}, req.body,(err)=>{
        if(err) return res.status(400).json({
            error: true,
            message: "Erro: Usuário não editado com sucesso!"
        });
        return res.json({
            error: false,
            message: "Usuário editado com sucesso"
        });
    });
});

app.delete("/usuarios/:id",(req, res) => {
    Usuarios.deleteOne({_id: req.params.id},(err)=>{
        if(err) return res.status(400).json({
            error: true,
            message: "Erro: Usuário não removido com sucesso!"
        });
        return res.json({
            error: false,
            message: "Usuário removido com sucesso"
        });
    
    });

});

app.post("/usuarios", ValidarUsuarios,(req,res)=>{
    Usuarios.create(req.body,(err)=> {
        if(err) return res.status(400).json({
            error: true,
            message: "Erro usuário não foi cadastrado com sucesso!"
        })
        return res.json({
            error: false,
            message: "Usuário cadastrado com sucesso!"
        })
    });
   
});

app.listen(8080,()=>{
    console.log("Servidor iniciado na porta 8080: http://localhost:8080");

});