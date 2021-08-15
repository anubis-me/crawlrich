const { model, Schema } = require('mongoose');


const postSchema = new Schema({
    url      : String,
    urllink  : [{
        type:String
    }],
    urllink2  : [{
        type:String
    }],
    urllink3  : [{
        type:String
    }],
    urllink4  : [{
        type:String
    }],
    wordcount: String
});


module.exports = model('model', postSchema);