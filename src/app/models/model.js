var mongoose = require('mongoose');
 
var imageSchema = new mongoose.Schema({
    name: {type:String},
    desc: {type:String},
    img:
    {
        data: {type:Buffer},
        contentType: {type:String}
    }
});

module.exports = new mongoose.model('Image', imageSchema);