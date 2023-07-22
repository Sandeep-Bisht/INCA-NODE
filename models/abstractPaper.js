const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const abstractPaperSchema = new Schema({
    authorSaluation: {type : String, require:true },
    authorFirstName: {type : String, require:true },
    authorMiddleName: {type : String, require:true },
    authorLastName: {type : String, require:true },
    authorEmail: {type : String, require:true },
    authorAffiliation: {type : String, require:true },
    coAuthorDetails: {type : Array},
    abstractPaperName: { type: String, require:true },
    abstract : { type: String, require: true },
    mimetype: { type: String, require:true },
    userId:{type:String, require:true},
    paperApproveStatus:{type:Boolean, require:true},
    registrationNumber:{type: String, require: true},
    abstractNumber: {type : String, require: true},
    themeType:{type: String, require: true},
    paperPresentationType: {type : String, require : true}
},{timestamps: true} 
)

module.exports = mongoose.model('abstractPaper', abstractPaperSchema)
