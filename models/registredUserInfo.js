const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let registredUserInfoSchema = new Schema({
    name: { type: String },
    designation: { type: String },
    affilation: { type: String },
    address: { type: String },
    pinCode: { type: Number },
    country: { type: String },
    phoneNumber: { type: Number  },
    email: { type: String },
    nationality: {type: String},
    conferenceMode: { type: String },
    participationType: { type: String },
    title: { type: String },
    journeyMode: { type: String },
    arrivalDate: { type: String },
    departureDate: { type: String },
    accompanningPerson: { type: Array },
    accomodationDetail: { type: String },
    registrationCategory: { type: String },
    registrationFee: { type: String },
    transactionId: { type: Number },
    bank: { type: String },
    dated: { type: String },
    userId:{type:String},
    attendanceStatus:{type:Boolean},
    systemRole:{type:String},
    registrationNumber:{type:String},

    
    bankName:{type:String},
    accountHolderName:{type:String},
    accountNumber:{type:String},
    transactionNumber:{type:String},
    referenceNumber:{type:String},
    mannualPaymentStatus:{type:String}
}, {timestamps: true})

module.exports = mongoose.model('registredUserInfo', registredUserInfoSchema)
