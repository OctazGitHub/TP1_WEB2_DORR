const mongoose= require('mongoose');

//schéma de données pour a collection usagers_v2
// _id, nom, password, roles, date

let schemaUsager = mongoose.Schema({
_id:{
    type: String,
    required: true
},
nom:{
    type: String,
    required: true
},
password:{
    type: String,
    required: true
},
date:{
    type:Date,
    required: true,
    default: Date.now()
}
});



let Usagers = module.exports = mongoose.model('usagers_v2',schemaUsager);