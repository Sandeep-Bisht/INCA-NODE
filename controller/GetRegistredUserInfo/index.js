let registredUserInfo = require('../../models/registredUserInfo')
exports.getAllRegistredUsersData = async (req, res) => {
    try {
        let response = await registredUserInfo.find()
        res.send(response)

    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }
}
