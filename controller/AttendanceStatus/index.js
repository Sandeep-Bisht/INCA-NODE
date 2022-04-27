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
