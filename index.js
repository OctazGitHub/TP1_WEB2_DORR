const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash'); 
const session = require('express-session');
const passport = require('passport');
const mongoose = require("mongoose");

//INSERER CONFIG DE PASSPORT;;;
require('./config/passport')(passport);


//LAYOUTS-EJS
app.use(expressLayouts);

//Récupérer POST (dans les requete.body)
app.use(express.urlencoded( { extended:false } ) );

//Création de la session express
app.use(session({
    secret:'HEHE',
    resave: true,
    saveUninitialized: true
})); 

//Pour initialisez passport
app.use(passport.initialize());
app.use(passport.session());

//Connexion a flash
app.use(flash());

//quelques variables globales pour le bon fonctionnement de l'authentification
app.use((requete, reponse, next)=>{
    reponse.locals.success_msg = requete.flash('success_msg');
    reponse.locals.erreur_msg = requete.flash("erreur_msg");
    reponse.locals.erreur_passport = requete.flash('error');
    next();
});

//Mes routes
app.use('/',require('./routes/index'));
app.use('/usagers',require('./routes/usagers'));

//Mes views
app.set("views","./views");
app.set("view engine","ejs");
app.set('layout','layout');

//ATLAS-----


const monngodb_url="mongodb+srv://Raph1:Rafi12345@cluster0.hbcn3fo.mongodb.net/authDB?retryWrites=true&w=majority";

mongoose.connect(monngodb_url, {useNewUrlParser: true,useUnifiedTopology: true}).then(()=>{
    console.log("mongodb is connected");
}).catch((error)=>{
    console.log("mongodb not connected");
    console.log(error);
});

//ATLAS----


/** 
//MONGODB---------------------
mongoose.connect("mongodb://127.0.0.1/Cours04");
let db = mongoose.connection;
db.on("error", (err)=>{
    console.error("erreur de BD pour les usagers et livres", err);
});
db.on("open",()=> {
    console.log("Connexion a la BD pour les usagers et les livres OK");
});
//MONGODB--------------------
*/

//create server
app.listen(PORT, console.log("Web démarré sur port :", PORT));

