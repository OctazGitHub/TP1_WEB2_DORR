const { response } = require('express');
const express= require('express');
const router = express.Router();
 const {estAuthentifie} = require('../config/auth');

//ajout des config d'auth globable

router.get("/",(requete, reponse)=> reponse.send("Page d'acceuil?essaye menu aulieux :)"));
router.get("/index", estAuthentifie, (requete, reponse)=>{
    console.log(requete.user)
    reponse.render('index',{user: requete.user});
});
router.get("/admin", (requete, reponse)=>{
    console.log(requete.user)
    reponse.render('admin',{user: requete.user});
});
router.get("/menu", estAuthentifie,(requete, reponse)=>{
    reponse.render('menu');
});



module.exports = router;