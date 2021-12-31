const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Turnover = new Schema({
    time: { type: String, maxlength: 50 },
    turnover: { type: Number },
    loss: { type: Number },
    profit: { type: Number }

});

module.exports = mongoose.model('turnovers', Turnover);