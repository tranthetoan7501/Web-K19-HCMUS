const Menu = require('../models/Menu');
const userService = require('../service/userService')
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
        const {name,username,password,email,date,phoneNumber} = req.body;
        const error = await userService.checkValidInput(name,username,password,email,date,phoneNumber);
        if(error === {}) {
            res.render('sign-up',{error})
        }
        else{
        const user = await userService.register(name,username,password,email,phoneNumber,date);
        res.render("sign-up",{user});
        }
    }
}
module.exports = new SitesController;