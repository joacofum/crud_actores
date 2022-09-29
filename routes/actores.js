const express = require("express");
const ActorSchema = require("../models/actor");
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

//Crear actor.
router.post("/add", async (req, res) => {
    //Lista de películas
    const moviesId = JSON.stringify(req.body.moviesId);

    //Fetch para obtener las películas que existan.
    const data_peliculas = await fetch(
      "http://localhost:3000/movies/chequearPeliculaExiste", {
      method: 'POST',
      body: moviesId,
      headers: { 'Content-Type': 'application/json'
      }
    }); 

    const id_peliculas_list = await data_peliculas.json();

    const actor = ActorSchema({
      name: req.body.name,
	    moviesId: id_peliculas_list
    })

    actor
      .save()
      .then((data) => {
        res.json(data)
      })
      .catch((err) => res.json({ message: err }));
  });
  
  //Get actores.
  router.get("/findAll", (req, res) => {
    ActorSchema
      .find()
      .then(async (actores) => {
        const result = actores.map(async (actor) => { 
          const moviesId = JSON.stringify(actor.moviesId);
          const data_peliculas = await fetch(
            "http://localhost:3000/movies/obtenerPeliculasActor", {
            method: 'POST',
            body: moviesId,
            headers: { 'Content-Type': 'application/json'
            }
          }); 
          const peliculas = await data_peliculas.json();

          //Creo un objeto nuevo para retornarlo con el nombre del actor
          //y las películas del actor.
          var actor_pelicula = new Object();
          actor_pelicula.name = actor.name;
          actor_pelicula.movies = peliculas;
          return actor_pelicula;
        })
        Promise.all(result).then((actor_with_movies) => { res.json(actor_with_movies) })
      })
      .catch((err) => res.json({ message: err }));
      
  /*   ActorSchema
      .find()
      .populate('moviesId')
      .exec((err, actor) => {
        if (err) return console.log(err);
        res.json(actor);
    }) */

  });
  
  //Obtener actor por id.
  router.get("/findById/:id", (req, res) => {
    ActorSchema
      .findById({_id: req.params.id})
      .then(async (actor) => {
        //Paso la lista de id de películas que tiene el actor.
        const moviesId = JSON.stringify(actor.moviesId);
        const data_peliculas = await fetch(
          "http://localhost:3000/movies/obtenerPeliculasActor", {
          method: 'POST',
          body: moviesId,
          headers: { 'Content-Type': 'application/json'
          }
        }); 
        const peliculas = await data_peliculas.json();

        //Creo un objeto nuevo para retornarlo con el nombre del actor
        //y las películas del actor.
        var actor_pelicula = new Object();
        actor_pelicula.name = actor.name;
        actor_pelicula.movies = peliculas;
        res.json(actor_pelicula)
      })
      .catch((err) => res.json({ message: err }));
  });
  
  //Update actor.
  router.put("/updateById/:id", (req, res) => {
      const { name } = req.body;
      ActorSchema
        .findByIdAndUpdate({_id: req.params.id}, { $set: {name}})
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
    });
  
  //Delete actor.
  router.delete("/deleteById/:id", (req, res) => {
      const { id } = req.params;
      ActorSchema
        .deleteOne({_id: id})
        .then((data) => res.json(data))
        .catch((err) => res.json({ message: err }));
    });


  module.exports = router;