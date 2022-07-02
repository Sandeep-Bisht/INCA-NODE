const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const exhibitorSchema = new Schema({
    name: { type: String, require:true },
    email : { type: String, require: true, },
    mobile:{ type:String, require:true },
    companyName: { type: String, require:true },
    // sponsorType: { type: String, require:true },
    exhibitionFee: { type: String, require:true },
    
},{timestamps: true} 
)

module.exports = mongoose.model('exhibitor', exhibitorSchema)