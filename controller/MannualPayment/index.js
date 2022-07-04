let transactionDetails = require('../../models/transactionDetails')


exports.saveUserMannualTransactionDetails = async(req, res) => {
    let mannualTransaction = new transactionDetails(req.body)
        mannualTransaction.mannualPaymentStatus = "unpaid"
    try {
        let result = await mannualTransaction.save()
       return res.send({ message: "Your transaction details are submitted successfully, once reviewed and confirmed from accounts department; your registration will be confirmed" })
    }
    catch (error) {
     return   res.send({ message: "Error occured while saving transaction details ", error })
    }
}

exports.saveUserMannualTransactionDetails = async(req, res) => {
    let mannualTransaction = new transactionDetails(req.body)
        mannualTransaction.mannualPaymentStatus = "unpaid"
    try {
        let result = await mannualTransaction.save()
       return res.send({ message: "Your transaction details are submitted successfully, once reviewed and confirmed from accounts department; your registration will be confirmed" })
    }
    catch (error) {
     return   res.send({ message: "Error occured while saving transaction details ", error })
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