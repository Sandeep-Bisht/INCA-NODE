let users = require('../../models/user')
exports.getUsers = async (req, res) => {
    try {
        let response = await users.find({})
        res.send(response)

    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }
}

exports.deleteUser = async (req, res) => {
    var id = req.params.id;
    try {
        let response = await users.findOne({_id : id})
            response.status = false
        let result = response.save()
        res.send({message:"user deleted successfully"})

    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }
}