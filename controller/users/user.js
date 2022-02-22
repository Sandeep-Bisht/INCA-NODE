let users = require('../../models/user')

exports.getUsers = async(req, res) => {
    try {
        let response = await users.find()
        res.send(response)

    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }
}

exports.deleteUser = async(req, res) => {
    var id = req.params.id;
    users.deleteOne({ id: id }, (err, result) => {
        if (err) {
            res.json({ message: "Error occured while deleting data" })
        }
        else {
            res.json({ message: "Data deleted successfully" })
        }
    })
}