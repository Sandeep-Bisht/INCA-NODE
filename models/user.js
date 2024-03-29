const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userSchema = new Schema({
    userName: { type: String },
    userEmail : { type: String, require: true, index:true, unique:true, sparse:true},
    mobileNumber:{ type:String },
    role:{ type:String },
    password: { type: String, require:true },
    status: { type: Boolean},
},{timestamps: true} 
)

module.exports = mongoose.model('users', userSchema)
