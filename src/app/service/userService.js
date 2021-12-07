const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.findByUsername = (username) => {
    return User.findOne({
        username: username,
        role: "Admin"
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
        role: "Admin"
    });
}
