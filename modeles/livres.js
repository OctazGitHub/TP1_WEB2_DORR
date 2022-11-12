const mongoose = require("mongoose");

//schéma de données pour les livres 
//_id,titre,auteur,résumé,éditeur,pages,langue,date,prix

let schemaLivre = mongoose.Schema( {
    _id:{type: String,required: false},
    titre:{type:String, required:true},
    auteur:{type:String, required:true},
    resumé:{type:String, required:true},
    éditeur:{type:String, required:true},
    prix:{type:String, required:true}
 });

let Livres = module.exports = mongoose.model("livres",schemaLivre);

module.exports.getLivres=(callback)=>{
    Livres.find(callback)
};

module.exports.getLivreById = (idLivre, callback) => {
    Livres.findById(idLivre, callback);
 };
 