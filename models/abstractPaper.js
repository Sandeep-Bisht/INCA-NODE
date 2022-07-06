const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const abstractPaperSchema = new Schema({
    userName: {type : String, require:true },
    userEmail: {type : String, require:true},
    abstractPaperName: { type: String, require:true },
    abstractPaperDescription : { type: String, require: true },
    mimetype: { type: String, require:true },
    abstractFileUrl : { type: String, require: true },
    userId:{type:String, require:true},
    paperApproveStatus:{type:Boolean, require:true},
    registrationNumber:{type: String, require: true},
    themeType:{type: String, require: true}
},{timestamps: true} 
)

module.exports = mongoose.model('abstractPaper', abstractPaperSchema)
