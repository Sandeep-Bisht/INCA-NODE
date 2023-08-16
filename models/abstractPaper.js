const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const abstractPaperSchema = new Schema({
    userName: {type : String, require: true},
    userEmail: {type : String, require: true},
    authorSaluation: {type : String, require:true },
    authorFirstName: {type : String, require:true },
    authorMiddleName: {type : String,},
    authorLastName: {type : String, require:true },
    authorEmail: {type : String, require:true },
    abstractPaperFileUrl : { type: String, require: true },
    authorAffiliation: {type : String, require:true },
    coAuthorDetails: {type : Array},
    abstractPaperName: { type: String, require:true },
    abstract : { type: String, require: true },
    mimetype: { type: String, require:true },
    userId:{type:String, require:true},
    paperApproveStatus:{type:Boolean, require:true},
    registrationNumber:{type: String, require: true},
    abstractNumber: {type : String, require: true},
    themeType:{type: Array, require: true},
    paperPresentationType: {type : String, require : true}
},{timestamps: true} 
)

module.exports = mongoose.model('abstractPaper', abstractPaperSchema)
