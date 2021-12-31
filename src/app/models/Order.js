const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Order = new Schema({
    username: { type: String, maxlength: 100 },
    items: { type: Array },
    fullname: { type: String, maxlength: 100 },
    email: { type: String, maxlength: 100 },
    phoneNumber: { type: String, maxlength: 100 },
    date: { type: Date },
    status: { type: String, maxlength: 100 },

});

module.exports = mongoose.model('orders', Order);