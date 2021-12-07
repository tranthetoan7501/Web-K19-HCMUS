const Menu = require('../models/Menu');

class SitesController{

    //get//new
    home(req,res, next){ 
        const wrongPass = req.query['wrong-password'] !== undefined;
        if(wrongPass){
            res.render('home',{wrongPass}); 
        }else{
            res.render('home')
        } 
    }
    

    //get; sign in
    in(req,res){
        const wrongPass = req.query['wrong-password'] !== undefined;
        res.render('sign-in',{wrongPass});
    }

    logout(req,res){
        req.logout();
        res.redirect('/')
    }

    //get: sign up
    up(req,res){
    res.render('sign-up');
    }

    async submit(req,res){
        const {name,username,password,email,date,phoneNumber,role} = req.body;
        const user = await userService.register(name,username,password,email,phoneNumber,date,role);
        res.redirect("/sign-in");
    }
}
module.exports = new SitesController;