const Menu = require('../models/Menu');
const { ToArrObject } = require('../../util/mongoose');
const User = require('../models/User');

const perPage = 15;

class adminService{
    viewItem(pageRequest,numItem,items){
        let page = parseInt(pageRequest)||1;   
        let totalPage = Math.floor(numItem/perPage) + 1;
        let start = (page-1)*perPage;
        let end;
        if (page==totalPage){
            end = numItem;
        }
        else{
            end = start + perPage;
        }
        return items.slice(start,end);
    }
    paginationArray(pageRequest,numItem,slug){
        if(numItem<=perPage){
            return null;
        }
        let page = parseInt(pageRequest)||1;
        let totalPage = Math.floor(numItem/perPage) + 1;
        let totalPageArr = [];
            for (let i=1;i<=totalPage;i++){
                totalPageArr.push({
                    value : i,
                    isCurrent: page === i,
                    category:slug
                });
            } 
        return totalPageArr;    
    }

    paginationArrayFilter(pageRequest,numItem,slug,type,order){
        if(numItem<=perPage){
            return null;
        }
        let page = parseInt(pageRequest)||1;
        let totalPage = Math.floor(numItem/perPage) + 1;
        let totalPageArr = [];
            for (let i=1;i<=totalPage;i++){
                totalPageArr.push({
                    value : i,
                    isCurrent: page === i,
                    category:slug,
                    type:type,
                    order:order
                });
            } 
        return totalPageArr;    
    }

    async itemAndPagiantion(req,res,next){
        if (req.query.order && req.query.category && req.query.type) {
            let type;
            if (req.query.order == "asc") {
                if (req.query.type === "price") {
                    type = { new_price: 1, price: 1 }
                }
                else if (req.query.type === "rating") {
                    type = { rating: 1, num_rating:1}
                }
                const items = ToArrObject(await Menu.find({ category: [req.query.category] }).sort(type));
                const count = items.length;
                let item = this.viewItem(req.query.page,count,items);
                const totalPageArrFilter = this.paginationArrayFilter(req.query.page, count, req.query.category,req.query.type,"asc"); 
                return {item,totalPageArrFilter}
            }
            else if (req.query.order == "dsc") {
                if (req.query.type === "price") {
                    type = { new_price: -1, price: -1 }
                }
                else if (req.query.type === "rating") {
                    type = { rating: -1, num_rating: -1}
                }
                const items =ToArrObject( await Menu.find({ category: [req.query.category] }).sort(type));
                const count = items.length;
                let item = this.viewItem(req.query.page,count,items);
                const totalPageArrFilter = this.paginationArrayFilter(req.query.page, count, req.query.category,req.query.type,"dsc");
                return {item,totalPageArrFilter}
                
            }
        }
        else {
            const items =ToArrObject( await Menu.find({}));
            const count = items.length;
            let item = this.viewItem(req.query.page,count,items);
            let totalPageArr = this.paginationArray(req.query.page,count,"");
            return {item,totalPageArr}
        }

    }
    async accountAndPagination(req,res,next){
            const users =ToArrObject( await User.find({role: { $ne: "Admin" }}));
            const count = users.length;

            let user= this.viewItem(req.query.page,count,users);
            let totalPageArr = this.paginationArray(req.query.page,count,"");
            let page = parseInt(req.query.page)||1;
            return {user,totalPageArr,page}
    }

    async adminAndPagination(req,res,next){
        const users =ToArrObject( await User.find({role: "Admin" }));
        const count = users.length;

        let user= this.viewItem(req.query.page,count,users);
        let totalPageArr = this.paginationArray(req.query.page,count,"");
        return {user,totalPageArr}
}
}

module.exports = new adminService;