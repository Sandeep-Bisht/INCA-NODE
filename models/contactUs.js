const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name: {type : String, require: true},
    number: {type : String, require:true},
    email: {type: String, require:true},
    subject:{type:String , require:true},
    message: {type:String , require:true}
}, {timestamps : true})