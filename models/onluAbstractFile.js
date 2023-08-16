const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const onlyAbstractFileSchema = new Schema({
    userName: {type : String, require: true},
    userEmail: {type : String, require: true},
    abstractPaperFileUrl : { type: String, require: true },
    mimetype: { type: String, require:true },
    userId:{type:String, require:true},
    paperApproveStatus:{type:Boolean, require:true},
    registrationNumber:{type: String, require: true},
    abstractNumber: {type : String, require: true},
},{timestamps: true} 
)

module.exports = mongoose.model('onlyAbstractFile', onlyAbstractFileSchema)
