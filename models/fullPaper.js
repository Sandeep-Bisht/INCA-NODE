const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const fullPaperSchema = new Schema({
    authorFirstName: {type : String, require:true },
    authorMiddleName: {type : String, require:true },
    authorLastName: {type : String, require:true },
    authorEmail: {type : String, require:true },
    authorAffiliation: {type : String, require:true },
    coAuthorDetails: {type : Array},    
    fullPaperName: { type: String, require:true },
    mimetype: { type: String, require:true },
    fullPaperFileUrl : { type: String, require: true },
    userId:{type:String, require:true},
    paperApproveStatus:{type:Boolean, require:false},
    paperPresentationType: {type : String, require : true},
    themeType:{type: String, require: true},
    registrationNumber:{type: String, require: true},
    fullPaperNumber : {type: String, require: true},

},{timestamps: true} )

module.exports = mongoose.model('fullPaper', fullPaperSchema)