let transactionDetails = require('../../models/transactionDetails')
const userRegisteredInfo = require("../../models/registredUserInfo")


exports.saveUserMannualTransactionDetails = async(req, res) => {
    let mannualTransaction = new transactionDetails(req.body)
    let info = new userRegisteredInfo()
    let {bankName, accountNumber, registrationNumber, transactionNumber , referenceNumber, accountHolderName } = req.body
        mannualTransaction.mannualPaymentStatus = "unpaid"
    let response = await findUserByRegistrationNumber(registrationNumber)
       if(response){
            response.bankName = bankName
            response.accountNumber = accountNumber
            response.transactionNumber = transactionNumber
            response.referenceNumber = referenceNumber
            response.accountHolderName = accountHolderName
            response.mannualPaymentStatus = "unpaid"
       }  
    try {
        let data = await response.save() 
        if(data ){
            let result = await mannualTransaction.save()
            return res.send({ message: "Your transaction details are submitted successfully, once reviewed and confirmed from accounts department, your registration will be confirmed" })
        }
    }
    catch (error) {
     return   res.send({ message: "Error occured while saving transaction details ", error })
    }
}

exports.getPaymentStatusById = async(req, res) => {
    let id = req.params.id;
    try {
        let user = await userRegisteredInfo.find({userId:id})
        res.send(user)
    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }
}

exports.getMannualPaymentInfo = async(req, res) => {
    try {
        let response = await transactionDetails.find()
        res.send({response, message:"Request completed successfully"})
    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }
}


let findUserByRegistrationNumber = async(val) => {
    let response = await userRegisteredInfo.findOne({registrationNumber:val})
    return response
}