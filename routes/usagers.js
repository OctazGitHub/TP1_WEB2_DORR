
const express= require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require("bcryptjs");
const Usagers = require('../modeles/usagers');
const Livres = require('../modeles/livres');
const {estAuthentifie} = require('../config/auth');



//ajout des config d'auth globable

router.get("/login",(requete, reponse)=> reponse.render('login'));

router.get("/logout",(requete,reponse)=>{
    requete.logout((err)=>{
        if (err) throw err;
        requete.flash('success_msg',"Deconnexion réussi");
        reponse.redirect("/usagers/login")
    });
});

router.post("/login",(requete, reponse, next)=> {
    passport.authenticate('local',{
        successRedirect:"/menu",
        badRequestMessage:"Remplir tous les champs",
        failureRedirect:"/usagers/login",
        failureFlash: true,

    })(requete, reponse, next);
});

router.get("/menu", estAuthentifie,(requete, reponse) => {
    reponse.render('menu')
   });
   

router.get("/menu", estAuthentifie,(requete, reponse) => {
 reponse.render('menu')
});

router.get("/listeLivres", estAuthentifie,(requete, reponse) => {
    Livres.find({},(err, tousLivres)=>{
        if(err)throw err;
        reponse.render('listeLivres',{
            livre: requete.livre,
            tousLivres: tousLivres
        });
    });
});


router.get('/liste',(requete, reponse)=>{
    Usagers.find({},(err, tousUsagers)=>{
        if(err)throw err;
        reponse.render('listeUsagers',{
            user: requete.user,
        tousUsagers: tousUsagers
        });
    });
});

router.get("/editer/:email", estAuthentifie, (requete, reponse) => {
    _id = requete.params.email;
  
    Usagers.findById(_id).then((user) => {
      if (user) {
        reponse.render("editer", { user });
      }
      Usagers.find({}, (err, tousUsagers) => {
        reponse.render("listeUsagers", {
          user: requete.user,
          tousUsagers: tousUsagers,
        })
      });
    })
  });

router.post("/editer/:email", (requete, reponse) => {
    Usagers.findById(_id).then((usager) => {
      console.log(usager);
      usager.deleteOne()
      const { nom, _id, password, password2 } = requete.body;
      let erreurs = [];
  
      if (!nom || !_id  || !password || !password2) {
        erreurs.push({ msg: "Remplir tout les champs" });
      }
      if (password.length < 4) {
        erreurs.push({ msg: "Le mot de passe doit contenir 4 caractères minimum" });
      }
      if (password !== password2) {
        erreurs.push({ msg: "Les mots de passe doivent être identique" });
      }
      if (erreurs.length > 0) {
        console.log(erreurs)
        reponse.render("editer:/email", {
          erreurs,
          nom,
          _id,
          password,
          password2,
        });
      } else {
        const nouveauUsager = Usagers({ nom, _id, password });
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(password, salt, (err, hache) => {
            nouveauUsager.password = hache;
            nouveauUsager
              .save() //ecrire dans la BD
              .then((usager) => {
                requete.flash(
                  "success_msg",
                  "Usager Mis à jour... Vous pouvez vous connecter"
                );
                reponse.redirect("./listeUsagers");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    })
  });

router.get("/supprimer/:email", (requete, reponse) => {
    _id = requete.params.email;
    Usagers.findById(_id).then((user) => {
      if (user) {
        reponse.render("supprimer", {user});
      } else {
        Usagers.find({}, (err, tousUsagers) => {
          //callback necessaire
          if (err) throw err;
          reponse.render("listeUsagers", {
            user: requete.user,
            tousUsagers: tousUsagers,
          })
        })
      }
    })
  });


router.post("/supprimer/:email", (requete, reponse) => {
    Usagers.findById(_id).then((usager) => {
      usager.deleteOne().then((user) => {
        requete.flash(
          "success_msg",
          "Usager Supprimer avec succes"
        );
        reponse.redirect("./liste");
      })
    })
  })

router.get("/ajouter",(requete, reponse)=> {
        reponse.render('ajouter');
    });

router.post("/ajouter",(requete, reponse)=> {
    const { nom, _id, password, password2}=requete.body;
    let erreurs = [];

    if(!nom || !_id || !password || !password2 ){
        erreurs.push({msg:"Remplir tous les champs"});
    }
    if(password.length < 4){
        erreurs.push({msg: "Le mot de passe 4 car. Min"});
    }
    if(password!=password2){
        erreurs.push({msg: "Les mots de passe ne sont pas identiques"});
    }
    if(erreurs.length > 0){
        reponse.render('ajouter', {
            erreurs,
            nom,
            _id,
            password,
            password2
        });
    }else{
        //Ajout a la BD
        Usagers.findById(_id)
        .then(usager => {
            if(usager) {
            erreurs.push({ msg : "Ce couriel existe deja"});
            reponse.render('ajouter', {
                erreurs,
                nom,
                _id,
                password,
                password2
               });
            }else{
                const newUsagers= new Usagers({nom,_id,password});
                //ici on va hacher le mot de passe
                bcrypt.genSalt(10,(err, salt)=>{
                    if(err) throw err;
                    bcrypt.hash(password, salt, (err,hache)=>{
                    newUsagers.password = hache;      
                    newUsagers.save()
                    .then(user =>{
                        requete.flash('success_msg','Usager ajouté avec succés');
                        reponse.redirect('/usagers/liste');
                    })
                     .catch(err => console.log(err));
                })
            })
            }
        }
    )}
});
module.exports = router;