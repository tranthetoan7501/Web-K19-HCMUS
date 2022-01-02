const Menu = require('../models/Menu');
const { ToArrObject } = require('../../util/mongoose');
const { ToObject } = require('../../util/mongoose');
const User = require('../models/User');
const Turnover = require('../models/Turnover');
const Order = require('../models/Order');
const fs = require('fs');
const userService = require('../service/userService')

const path = require('path');


class AdminController{
    //get : create
    create(req,res,next){
        res.render('admin/create');
    }

    // //post : store
    store(req,res,next){
        Menu.findOne()
            .sort('-id')
            .then((item) => {
                var newId = item.id + 1;
                var newItem = req.body;
                let mySlug = req.body.name;
                newItem.slug = mySlug.replace(/ /g,'-') + "-" + newId;
                newItem.rating = 0.0;
                newItem.id = newId;
                newItem.num_rating=0;
                newItem.image = "data:image/image/png;base64,"+fs.readFileSync(path.join(__dirname + '../../../public/image/' + req.file.filename)).toString('base64');
                const menu = new Menu(newItem);
                return menu.save();
            })
            .then(()=>res.redirect('/admin/storedItems'))
            .catch(next);
    }

    storedItems(req,res,next){
        // console.log(req.query)
        if (req.query.order && req.query.category && req.query.type) {
            let type;
            if (req.query.order == "asc") {
                if (req.query.type === "price") {
                    type = { new_price: 1, price: 1 }
                }
                else if (req.query.type === "rating") {
                    type = { rating: 1, num_rating:1}
                }
                Menu.find({ category: [req.query.category] }).sort(type)
                    .then(item => res.render('admin/storedItems', {
                        item: ToArrObject(item)
                    }))
                    .catch(next);
            }
            else if (req.query.order == "dsc") {
                if (req.query.type === "price") {
                    type = { new_price: -1, price: -1 }
                }
                else if (req.query.type === "rating") {
                    type = { rating: -1, num_rating: -1}
                }
                Menu.find({ category: [req.query.category] }).sort(type)
                    .then(item => res.render('admin/storedItems', {
                        item: ToArrObject(item)
                    }))
                    .catch(next);
            }
        }
        else {
            Menu.find({})
                .then(item => res.render('admin/storedItems', {
                    item: ToArrObject(item)
                }))
                .catch(next);
        }
    }

    update(req,res,next){
        Menu.findOne({id:req.params.id})
            .then(item => res.render('admin/update',{ 
                item : ToObject(item)
            }))
            .catch(next);
    }

    storeUpdate(req,res,next){
        const newItem = req.body;
        let mySlug = req.body.name;
        newItem.slug = mySlug.replace(/ /g,'-') + "-" + req.params.id;
        newItem.updateAt = Date.now();
        Menu.updateOne({id:req.params.id},newItem)
            .then(()=>res.redirect('/admin/storedItems'))
            .catch(next);
    }

    //delete admin/:id/delete
    delete(req,res,next){
        Menu.deleteOne({id:req.params.id})
            .then(()=>res.redirect('back'))
            .catch(next);
    }

    viewAccount(req,res,next){
        res.render("admin/profile");
    }

    viewAllAccount(req,res,next){
        User.find({role:"Admin"})
            .then(user => res.render('admin/adminAccounts',{ 
                user : ToArrObject(user)
            }))
            .catch(next);
        
    }
    viewAllUserAccounts(req,res,next){
        User.find({role: { $ne: "Admin" }})
            .then(user => res.render('admin/userAccounts',{ 
                user : ToArrObject(user)
            }))
            .catch(next);
        
    }

    async viewUserAccount(req,res){
        
        let clientUser =await User.findOne({username:req.query.username}).lean();
        console.log(clientUser.username);
        res.render('admin/profile',{
            clientUser:clientUser
        });
    }
    updateAccount(req,res,next){
        res.render("admin/updateAccount");
    }
    async storeUpdateAccount(req,res,next){
        const username = req.session.passport.user.username;
        console.log(username);
        let userInfo = await User.findOne({username:username}).lean();

        console.log(userInfo);
        userInfo.name = req.body.name;
        req.session.passport.user.name = req.body.name;

        userInfo.dateOfBirth = req.body.dateOfBirth;
        req.session.passport.user.dateOfBirth = req.body.dateOfBirth;

        userInfo.phoneNumber = req.body.phoneNumber;
        req.session.passport.user.phoneNumber = req.body.phoneNumber;

        userInfo.image = req.body.image;
        req.session.passport.user.image = req.body.image;

        User.updateOne({username:username},userInfo)
            .then(()=>res.redirect('/admin/profile'))
            .catch(next);
    }

    getStatistic(req, res, next) {
        Promise.all([Turnover.find({}).lean()])
            .then(([dataset]) => {
                var xValues = [];
                var yValues = [];

                for (var i in dataset) {
                    xValues.push(dataset[i].time);
                    yValues.push(dataset[i].turnover);
                }
                // console.log(xValues, yValues);

                res.render("admin/statistic", {
                    xValues: xValues,
                    yValues: yValues
                })
            }
        )
    }

    getTrending(req, res, next) {
        Promise.all([Order.find({}).lean()])
            .then(([dataset]) => {
                var productList = [];
                var productName, index;
                
                for (var i in dataset) {
                    // console.log(dataset[i].ite   ms);
                    for (var j in dataset[i].items) {
                        productName = dataset[i].items[j].productName;
                        index = productList.indexOf(productName)
                        if (index === -1) {
                            productList.push([ productName, 1 ]);
                        } else {
                            productList[index][1]++;
                        }
                    }
                }

                productList.sort((a, b) => (a.count < b.count) ? 1 : -1)


                console.log(productList);    
                res.render("admin/trending", {
                    topProducts: productList.slice(0, 10)
                })
            }
        )
    }

    changePassword(req,res){
        res.render("admin/changePassword");
    }

    async postChangePassword(req,res){
        const {oldpassword, password, confirmPassword} = req.body;
        const result = await userService.changePassword(req.user.username,oldpassword,password,confirmPassword)
        if(result !== "Success"){
            return res.render("admin/changePassword",{result});
        }
        return res.redirect("/admin/profile")
    }

}
module.exports = new AdminController;