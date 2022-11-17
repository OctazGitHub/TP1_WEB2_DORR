module.exports= {
estAuthentifie:function(requete, reponse, next){
    if(requete.isAuthenticated()){
        return next();
    }else{
        requete.flash(
        'erreur_msg',
        'Vous devez etre connecté pour consulter cette page'
        );
        reponse.redirect("/usagers/login")
    }
},
estAdmin: function(requete, reponse, next){
    if(requete.isAuthenticated()){
        //on valide est admin....
        const rolesUser = requete.user.roles;
        const admin = rolesUser.find(role=>role == 'admin');
        if(admin){
            return next();
        }else{
            requete.flash('erreur_msg','vous devez avoir le role admin')
            reponse.render('contenu',{user:requete.user})
        }
    }else{
        requete.flash(
            'erreur_msg',
            'Vous devez etre connecté pour consulter cette page'
            );
            reponse.redirect("/usagers/login")
    }
},
estGestion: function(requete, reponse, next){
    if(requete.isAuthenticated()){
        //on valide est admin....
        const rolesUser = requete.user.roles;
        const gestion = rolesUser.find(role=>role == 'gestion');
        if(gestion){
            return next();
        }else{
            requete.flash('erreur_msg','vous devez avoir le role admin ou gestion')
            reponse.render('contenu',{user:requete.user})
        }
    }else{
        requete.flash(
            'erreur_msg',
            'Vous devez etre connecté pour consulter cette page'
            );
            reponse.redirect("/usagers/login")
    }
}
}