const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const paymentSchema = new Schema({
    name: { type: String },
    email : { type: String, },
    number:{ type:String },
    amount:{ type:String },
    transactionId: { type: String },
    paymentStatus: { type: Boolean},
    userId:{type:String},
},{timestamps: true} 
)

module.exports = mongoose.model('payment', paymentSchema)