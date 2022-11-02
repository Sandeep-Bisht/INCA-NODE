let registredUserInfo = require('../../models/registredUserInfo')
exports.getRegistredUserInfoByEmail = async(req, res) => {
    var id = req.params.id;
    try {
        let user = await registredUserInfo.find({email:id})
        res.send(user)
    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }
} 