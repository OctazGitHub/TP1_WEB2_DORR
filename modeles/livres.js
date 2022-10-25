const mongoose = require("mongoose");

//schéma de données pour les livres 
//_id,titre,auteur,résumé,éditeur,pages,langue,date,prix

let schemaLivre = mongoose.Schema( {
    titre:{type:String, required:true},
    auteur:{type:String, required:true},
    resumé:{type:String, required:true},
    éditeur:{type:String, required:true},
    prix:{type:String, required:true}
 });

let Livres = module.exports = mongoose.model("livres",schemaLivre);

module.exports.getLivres=(callback,limit)=>{
    Livres.find(callback).limit(limit);
};

module.exports.getLivreById = (idLivre, callback) => {
    Livres.findById(idLivre, callback);
 };
 