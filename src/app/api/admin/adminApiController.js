const productService = require('../../service/productsService');
const User = require('../../models/User');
const Order = require('../../models/Order');

exports.postComment = async (req,res)=>{
    if(!req.user){
        res.status(401).json({
            message:'Unauthorized'
        });
        return;
    }
    const { productId } = req.params;
    const { content } = req.body;
    const { id : userId} = req.user;
    const { name: userName} = req.user;
    const comment = await productService.postComment(userId,userName,productId,content);
    res.status(200).json(comment);
};
exports.getPagination = async (req,res)=>{
    const { category } = req.params;
    const { page } = req.query;
    const productsWithPagination = await productService.getProductsWithPagination(category,page);
    res.status(200).json(productsWithPagination);
};
exports.updateUserAccount = async (req,res)=>{
    let thisUser = await User.findOne({username:req.params.name}).lean();
    if(req.query.option==='Ban'){ 
        thisUser.ban = true;
    }
    if(req.query.option==='Unban'){
        thisUser.ban = false;
    }
    const update = await User.updateOne({username:req.params.name},thisUser);
    const user = await User.find({role: { $ne: "Admin" }}).lean();

    res.status(200).json({user});
}
exports.changeOderStatus = async (req,res)=>{
    console.log(req.query.id);
    console.log(req.query.status);
    let id = req.query.id;
    let status = req.query.status;

    
    let thisOder= await Order.findOne({orderId:id}).lean();
    console.log(thisOder);
    if(status==='true'){
        thisOder.status = true;
    }
    if(status==='false'){
        thisOder.status = false;
    }
    const update = await Order.updateOne({orderId:id},thisOder);
    const orders = await Order.find({}).sort({creatAt: 'descending'}).lean();
    
    res.status(200).json({orders});
}