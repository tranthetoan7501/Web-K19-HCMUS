const productService = require('../../service/productsService');
const User = require('../../models/User');

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