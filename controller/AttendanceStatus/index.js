let registredUserInfo = require('../../models/registredUserInfo')

exports.verifyAttendanceStatus = async (req, res) => {
    var id = req.params.id;
    let user = await registredUserInfo.findById(id)
    try {
        user.attendanceStatus = true;
        let updateEntry = await user.save()
        res.json({ message: "data saved successfully" })
    }
    catch (err) {
        res.send(err)
    }
}

exports.getUserInfoForAttendance = async (req, res) => {
    var id = req.params.id;
    let user = await registredUserInfo.find({_id:id})
    try {
        res.json({ message: "Request completed successfully", data:user })
    }
    catch (err) {
        res.send(err)
    }
}

exports.verifyAttendanceStatusByPassword = async (req, res) => {
    var {id, password} = req.body
    if(id && password === "inca1234"){
        let user = await registredUserInfo.findById(id)
        try {
            user.attendanceStatus = true;
            let updateEntry = await user.save()
            res.json({ message: "attendance marked successfully" })
        }
        catch (err) {
            res.send(err)
        }
    }
    else {
        res.json({message:"only admin can mark your attendance"})
    }
}
