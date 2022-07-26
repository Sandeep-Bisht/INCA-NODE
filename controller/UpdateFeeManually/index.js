let transactionDetails = require('../../models/transactionDetails')
const userRegisteredInfo = require("../../models/registredUserInfo")
let abstractPaper = require('../../models/abstractPaper')

exports.updateFeeManuallyByAdmin = async(req, res) => {
    let id = req.params.id;
    let result = await transactionDetails.findOne({registrationNumber:id})
    let response = await userRegisteredInfo.findOne({registrationNumber:id})
       result.mannualPaymentStatus = "paid"
       response.mannualPaymentStatus = "paid"
       try {
        let data = await result.save()
        let  data1 = await response.save()

       return res.send({ message: "Payment Status Approved." })
    }
    catch (error) {
     return   res.send({ message: "Error occured while Approving payment  ", error })
    }
}