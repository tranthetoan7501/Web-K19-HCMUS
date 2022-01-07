const User = require('../models/User');
const Menu = require('../models/Menu');
const bcrypt = require('bcrypt');

exports.findByUsername = (username) => {
    return User.findOne({
        username: username,
        role: "Admin",
    }).lean();
}

exports.validPassword = async function (password,user){
   return bcrypt.compare(password,user.password);
}

// exports.validRole = async function(user){
//     return user.role === "Admin";
// }

exports.checkValidInput = async (fullname, username,password, email, date,phoneNumber,role) => {
    const error = {}
    const emailCheck = await User.findOne({
        email: email
    }).lean();
    const usernameCheck = await User.findOne({
        username: username
    }).lean();
    if(email === "") {
        error.emailCheck = "Email is required.";
    }
    else if(emailCheck){
        error.emailCheck = "Email is existed."
    }

    if(username === "") {
        error.usernameCheck = "Username is required.";
    }
    else if(usernameCheck){
        error.usernameCheck = "Username is existed."
    }

    return error
}

exports.register = async (name,username,password,email,phoneNumber,dateOfBirth) => {
    const pwdHashed = await bcrypt.hash(password,10);
    return User.create({
        name : name,
        username : username,
        password : pwdHashed,
        email: email,
       dateOfBirth: dateOfBirth,
        phoneNumber: phoneNumber,
        image: "https://www.w3schools.com/howto/img_avatar2.png",
        role: "Admin",
        key: false
    });
}

exports.reset = async(email,password) => {
    const pwdHashed = await bcrypt.hash(password,10);
    const user = await User.findOne({email}).lean();
    if(!user){
        return false;
    }
    await User.updateOne({
        email
    },{
        $set: {
            password: pwdHashed
        }
    });
    return true;
}

exports.changePassword = async(username,oldpassword,password,confirmPassword) =>{
    const user = await this.findByUsername(username);
    const check = await this.validPassword(oldpassword,user);
    if(check === false) return "Wrong old password."
    if(password !== confirmPassword) return "Wrong confirm password."
    await this.reset(user.email,confirmPassword);
    return "Success"
}

exports.checkValidInput = async (category,name,description,new_price,in_stock) =>{
    if(name.trim() === "" || description.trim()==="" || new_price <= 0 ||
    in_stock <= 0) return "All information must be filled";
    const check = await Menu.findOne({
        name: name,
    }).lean();
    if(check) {
        return "This product has existed in database."
    }
    return "Success";
}
