const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const transactionSchema = new Schema({
    registrationNumber:{type:String},
    bankName:{type:String},
    accountHolderName:{type:String},
    accountNumber:{type:String},
    userId:{type:String},
    transactionNumber:{type:String},
    referenceNumber:{type:String},
    email:{type:String},
    mannualPaymentStatus:{type:String}
},{timestamps: true} 
)

module.exports = mongoose.model('transactionDetails', transactionSchema)