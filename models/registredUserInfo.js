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
    conferenceMode: { type: String },
    participationType: { type: String },
    title: { type: String },
    journeyMode: { type: String },
    arrivalDate: { type: String },
    departureDate: { type: String },
    accompanyingPerson: { type: Array },
    accompanyingPerson: { type: String },
    accomodationDetail: { type: String },
    registrationCategory: { type: String },
    registrationFee: { type: String },
    transactionId: { type: Number },
    bank: { type: String },
    dated: { type: String },
    userId:{type:String},
    attendanceStatus:{type:Boolean},
    systemRole:{type:String}
}, {timestamps: true})

module.exports = mongoose.model('registredUserInfo', registredUserInfoSchema)
