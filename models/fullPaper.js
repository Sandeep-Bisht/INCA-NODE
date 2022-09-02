const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const fullPaperSchema = new Schema({
    userName: {type : String, require:true },
    userEmail: {type : String, require:true},
    fullPaperName: { type: String, require:true },
    mimetype: { type: String, require:true },
    fullPaperFileUrl : { type: String, require: true },
    userId:{type:String, require:true},
    paperApproveStatus:{type:Boolean, require:false},
    themeType:{type: String, require: true},
    registrationNumber:{type: String, require: true},

},{timestamps: true} )

module.exports = mongoose.model('fullPaper', fullPaperSchema)