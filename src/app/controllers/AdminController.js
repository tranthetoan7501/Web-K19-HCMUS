const Menu = require('../models/Menu');
const { ToArrObject } = require('../../util/mongoose');
const { ToObject } = require('../../util/mongoose');


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
                const newItem = req.body;
                let mySlug = req.body.name;
                newItem.slug = mySlug.replace(/ /g,'-') + req.body.id;
                newItem.rating = 0.0;
                newItem.id = newId;
                newItem.num_rating=0;
                const menu = new Menu(newItem);
                menu.save()
                    .then(()=>res.redirect('/admin/storedItems'))
                    .catch(next);
            })
            .catch(next);
    }

    storedItems(req,res,next){
        Menu.find({})
            .then(item => res.render('admin/storedItems',{ 
                item : ToArrObject(item)
            }))
            .catch(next);
        
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

}
module.exports = new AdminController;