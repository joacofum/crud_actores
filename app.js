require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const movieRoute = require("./routes/actores")


//Initiliazations
const app = express();

//Settings
app.set('port', process.env.PORT || 4000);

// Middleware
app.use(express.json());
app.use('/actores', movieRoute)

//Routes
app.get("/", (req, res)=>{
    res.send("Hola Raúl");
})

// Mongodb connection
mongoose.connect(process.env.URI)
.then(()=> console.log('Conexión a MongoDB con éxito'))
.catch((er) => console.error(er))


//Server is listenning
app.listen(app.get('port'), ()=>{
    console.log('Servidor corriendo', app.get('port'))
})