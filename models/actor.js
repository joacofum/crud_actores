const mongoose = require('mongoose');

//Objeto actor.
const actorSchema = mongoose.Schema({
	name: String,
	moviesId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'peliculas' }]
}, {versionKey: false})

const ActorModel = mongoose.model('actor', actorSchema)
module.exports = ActorModel;