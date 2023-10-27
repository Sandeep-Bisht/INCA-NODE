const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const presentationSchema = new Schema({
    userName: {type : String, require: true},  
    filename: { type: String, require:true },
mimetype: { type: String, require:true },
path : { type: String, require: true },
userId:{type:String, require:true},    
registrationNumber:{type: String, require: true},

},{timestamps: true} )

module.exports = mongoose.model('presentation', presentationSchema)