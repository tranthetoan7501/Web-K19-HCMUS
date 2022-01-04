const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Order = new Schema({
    orderId: {type:Number},
    username: { type: String, maxlength: 100 },
    items: { type: Array },
    fullname: { type: String, maxlength: 100 },
    email: { type: String, maxlength: 100 },
    address:{ type: String, maxlength: 100 },
    phoneNumber: { type: String, maxlength: 100 },
    date: { type: Date },
    status: { type: Boolean},
    creatAt: { type:Date, default:Date.now },

});

module.exports = mongoose.model('orders', Order);