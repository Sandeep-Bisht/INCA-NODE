let registredUserInfo = require('../../models/registredUserInfo')
exports.getAllRegistredUsersData = async (req, res) => {
    try {
        let response = await registredUserInfo.find()
        res.send(response)
    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }
}


exports.updateSaveRegistredUserInfoById = async (req, res) => {
    const { name,
    designation,
    affilation,
    address,
    pinCode,
    country,
    phoneNumber,
    email,
    conferenceMode,
    participationType,
    accompanningPerson,
    nationality,
    title,
    journeyMode,
    arrivalDate,
    departureDate,
    accomodationDetail,
    registrationCategory,
    registrationFee,
     _id
    } = req.body
    var id = req.params.id;
    let user = await registredUserInfo.findById(id)
    try {
        user.name = name
        user.accomodationDetail=accomodationDetail,
        user.address = address,
        user.affilation = affilation,
        user.arrivalDate = arrivalDate,
        user.departureDate = departureDate,
        user.conferenceMode = conferenceMode,
        user.designation = designation,
        user.country = country,
        user.email = email,
        user.journeyMode = journeyMode,
        user.participationType = participationType,
        user.accompanningPerson = accompanningPerson,
        user.nationality = nationality,
        user.phoneNumber = phoneNumber,
        user.pinCode = pinCode,
        user.registrationCategory = registrationCategory,
        user.registrationFee = registrationFee,
        user.title = title,
        user._id = _id
        let updateEntry = await user.save()
        res.json({ message: "Registred user information updated successfully" })
    }
    catch (err) {
        res.send(err)
    }
}


exports.getRegistredUserInfoById = async(req, res) => {
    var id = req.params.id;
    try {
        let user = await registredUserInfo.find({userId:id})
        res.send(user)
    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }
} 


