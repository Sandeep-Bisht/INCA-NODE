let users = require('../../models/user')
exports.getUsers = async (req, res) => {
    try {
        // let response = await users.find({})
        let response = await users.find(); //{ status: { $ne: false } }
        res.send(response)

    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }
}

exports.deactivateUser = async (req, res) => {
   
    let id = req.params.userId;
    try {
        let user = await users.findOne({ _id: id });
        
        user.status = false;
        let result = await user.save()
        if(result){
            res.send({ message: "User deleted successfully" });
        }

    } catch (error) {
        res.send({ message: "Error occured while deleting records" })
    }
}

exports.activateUser = async (req, res) => {
   
    let id = req.params.userId;
    console.log("inside delete user", id)
    try {
        let user = await users.findOne({ _id: id });        
         if(user){
            user.status = true;
            console.log("userrrr", user)
            let result = await user.save()
        if(result){
            res.send({ message: "User activated successfully" });
        }
         }
        
        

    } catch (error) {
        res.send({ message: "Error occured while activating user" })
    }
}