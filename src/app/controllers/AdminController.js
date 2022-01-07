const Menu = require('../models/Menu');
const { ToArrObject } = require('../../util/mongoose');
const { ToObject } = require('../../util/mongoose');
const User = require('../models/User');

const Order = require('../models/Order');
const fs = require('fs');
const userService = require('../service/userService')

const path = require('path');

const adminService = require('../service/adminService');


class AdminController{
    //get : create
    create(req,res,next){
        res.render('admin/create');
    }

    // //post : store
    async store(req,res,next){
        const {category,name,description,new_price,in_stock} = req.body;
        const check = await userService.checkValidInput(category,name,description,new_price,in_stock);
        if(check === "Success"){
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
        else{
            res.render('admin/create',{message: check});
        }
    }

    async storedItems(req,res,next){
        const itemAndpagination =await adminService.itemAndPagiantion(req,res,next);
        res.render('admin/storedItems',itemAndpagination);
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

    async viewAllAccount(req,res,next){
        let adminAndPagination = await adminService.adminAndPagination(req,res,next);
        res.render('admin/adminAccounts',
            adminAndPagination
        );
        
    }
    async viewAllUserAccounts(req,res,next){       
        let accountAndPagiantion = await adminService.accountAndPagination(req,res,next);
        res.render('admin/userAccounts',
            accountAndPagiantion
        );
        
    }

    async viewUserAccount(req,res){
        
        let clientUser =await User.findOne({username:req.query.username}).lean();
        res.render('admin/profile',{
            clientUser:clientUser
        });
    }
    updateAccount(req,res,next){
        res.render("admin/updateAccount");
    }
    async storeUpdateAccount(req,res,next){
        const username = req.session.passport.user.username;
        // console.log(username);
        let userInfo = await User.findOne({username:username}).lean();

        // console.log(userInfo);
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
        if (req.query.year_month) {
            var start = req.query.year_month + "-01";
            var end = req.query.year_month + "-31";
            var index, sum = 0;
            var turnover = [];

            for (var i = 1; i < 32; i++) {
                turnover.push({ day: "Day " + i, turnover: 0 })
            }

            Promise.all([Order.find({
                date: {
                    "$gte": start,
                    "$lt": end
                }
            }).lean()])
                .then(([dataset]) => {
                    // console.log(dataset)  
                    for (var i in dataset) {
                        var day = "Day " + dataset[i].date.getDate();
                        index = turnover.findIndex((obj => obj.day == day));

                        for (var j in dataset[i].items) {
                            turnover[index].turnover += dataset[i].items[j].price
                        }
                    }

                    for (var i in turnover) {
                        turnover[i] = Object.values(turnover[i]);
                        sum += turnover[i][1];
                    }

                    // console.log(turnover);
                    // console.log(sum);

                    res.render("admin/statistic", {
                        turnover: turnover,
                        total: sum
                    })
                }
                )
        } else if (req.query.year) {
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var start = req.query.year + "-01-01", end = req.query.year + "-12-31";
            var index, sum = 0;
            var quarter_turnover = [];
            var turnover = [];

            for (var i = 0; i < 12; i++) {
                turnover.push({ month: months[i], turnover: 0 })
            }

            Promise.all([Order.find({
                date: {
                    "$gte": start,
                    "$lt": end
                }
            }).lean()])
                .then(([dataset]) => {
                    for (var i in dataset) {
                        var month = months[dataset[i].date.getMonth()];
                        index = turnover.findIndex((obj => obj.month === month));
                        for (var j in dataset[i].items) {
                            turnover[index].turnover += dataset[i].items[j].price
                        }
                    }

                    for (var i in turnover) {
                        turnover[i] = Object.values(turnover[i]);
                        sum += turnover[i][1];
                    }

                    for (var i = 0; i < 12; i += 3) {
                        var total = turnover[i][1] + turnover[i + 1][1] + turnover[i + 2][1];
                        quarter_turnover.push({ quarter: i / 3 + 1, turnover: total })
                    }

                    // console.log(quarter_turnover);
                    // console.log(turnover);
                    // console.log(sum);

                    res.render("admin/statistic", {
                        turnover: turnover,
                        total: sum,
                        quarter_turnover: quarter_turnover
                    })
                }
            )

        } else {
            res.render("admin/statistic")
        }

    }

    getTrending(req, res, next) {
        Promise.all([Order.find({}).lean()])
            .then(([dataset]) => {
                var productList = [];
                var productName, index;
                
                for (var i in dataset) {
                    for (var j in dataset[i].items) {
                        productName = dataset[i].items[j].productName;
                        index = productList.findIndex((obj => obj.productName === productName));

                        if (index != -1) {
                            productList[index].count++;
                        } else {
                            productList.push({ productName: productName, count: 1})
                        }
                    }
                }

                productList.sort((a, b) => (a.count < b.count) ? 1 : -1)

                for (var i in productList) {
                    productList[i] = Object.values(productList[i]);
                }

                // console.log(productList.slice(0, 10));    
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

    async manageOrders(req,res){
        let orders = await Order.find({}).sort({date: 'descending'}).lean();
        res.render("admin/orders",{orders});
    }



}
module.exports = new AdminController;