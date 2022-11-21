const http = require('http');
const path = require('path');
const fs=require('fs');
const url= require('url');
const PORT = process.env.PORT || 8000;

//REQUIRE de tout les éléments besoin

const serveur=http.createServer((requete, reponse)=>{
    if(requete.url ==='/favicon.ico'){
        reponse.end();
        //Controle ERREUR /favicon.ico
    }else if (requete.url === '/'){
        let fileName= path.join(__dirname, 'views', 'login.ejs');
        afficherPageWeb(fileName, reponse,false);
        //Login MAIN
    }else{
        let fileName = path.join(__dirname, 'views', requete.url);
        afficherPageWeb(fileName, reponse,false);
        //Anything else
    }
});
serveur.listen(PORT , ()=> console.log(`le service web est démarré sur le PORT: ${PORT}`));



function obtenirTypeFichier(nomFichier) {
    //Afficher le bon type du  fichier
    const typeDeFichier = path.extname(nomFichier);
    let typeContenu = "text/html"; //default type de contenu
    switch (typeDeFichier) {
      case ".js":
        typeContenu = "text/javascript";
        break;
      case ".css":
        typeContenu = "text/css";
        break;
      case ".json":
        typeContenu = "application/json";
        break;
      case ".png":
        typeContenu = "image/png";
        break;
      case ".jpg":
        typeContenu = "image/jpg";
        break;
      case ".gif":
        typeContenu = "image/gif";
        break;
    }
    return typeContenu;
  }


function afficherPageWeb(nomFichier, reponse,personne){
    const typeContenu = obtenirTypeFichier(nomFichier);
    fs.readFile(nomFichier, 'utf-8',
    (err, contenu)=>{
                if (err) {
            //Si une Erreur
            if (err.code === "ENOENT") {
              //ENOENT => Error, No Entry
              console.log( `Page web introuvable`, nomFichier );
              reponse.writeHead(404, { "Content-Type": "text/html" });
              reponse.write(`<h1>Page Introuvable</h1>`);
              reponse.end();
            } else {
              reponse.writeHead(500, { "Content-Type": "text/html" });
              reponse.write(`<h1>Erreur du serveur code: ${err.code}</h1>`);
              reponse.end();
            }
        }else{
            reponse.writeHead(200,{ 'Content-type':obtenirTypeFichier(nomFichier)})
                if(personne){
                        contenu=contenu.replace(/_nom_nom/,personne.nom);
                        contenu=contenu.replace(/_login_login/,personne.login)
                }
            reponse.write(contenu);
            reponse.end();
        }
    }
    )
}
