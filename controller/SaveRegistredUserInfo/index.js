const userRegisteredInfo = require("../../models/registredUserInfo")

exports.saveRegistredUserInfo = async (req, res) => {
    console.log('insidre thiss')
    let info = new userRegisteredInfo(req.body)
    try {
        let saveEntry = await info.save() 
        res.send({message:"data saved"})
    }
    catch (error) {
        res.send({ message: "Error occured while saving user info", error })
    }
}