const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");

//récupérer le modele pour la collection usagers_v2
const Usagers= require('../modeles/usagers');

module.exports = function (passport){
    passport.use(
        new LocalStrategy( {usernameField:'_id' }, (_id,password, done)=>{
           Usagers.findOne( {_id: _id })
           .then((usager)=>{
            if(!usager){
                return done (null, false , {message:"Ce courriel n'existe pas!"})
            } 
            /*
            if (password == usager.password) {
                return done(null, usager);
            } else {
                return done(null, false, { message: "Mot de passe invalide!"});
            }
            **/
            bcrypt.compare(password,usager.password, (err,isMatch)=>{
                if (err) throw err;
                if (isMatch){
                    return done(null,usager);
                }else{
                    return done(null, false,{message: "Mot de passe invalide"});
                }
            });
           }) 
           .catch(err => console.log(err))
        })
    )
    passport.serializeUser(function(usager, done){
        done(null,usager._id);
    });
    passport.deserializeUser(function(id, done){
        Usagers.findById(id, function(err, usager){
            done(err,usager);
        })
    })    

    }


