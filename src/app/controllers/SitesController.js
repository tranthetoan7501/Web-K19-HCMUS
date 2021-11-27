const Menu = require('../models/Menu');

class SitesController{

    //get//new
    home(req,res, next){
        res.render('home');    
    }
    

    //get; sign in
    in(req,res){
        res.render('sign-in');
    }

    //get: sign up
    up(req,res){
        res.render('sign-up');
    }    
}
module.exports = new SitesController;