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


exports.updateRegisterUsersFee = async(req,res) =>{
    try {
        let response = await registredUserInfo.find()

        let updatedData = [];
    try{
        response.map(async(items)=>{
            let updatedFee = 0;
            if(items.registrationCategory == "Others (participants/delegates/members)" && items.nationality == "indian"){
                updatedFee = updatedFee + 4130;
            }

            if(items.registrationCategory == "Life Members" && items.nationality == "indian"){
                updatedFee = updatedFee + 3540;
            }

            if(items.registrationCategory == "For Students" && items.nationality == "indian"){
                updatedFee = updatedFee + 2360;
            }
            
            let accompningPerson = items.accompanningPerson.length;
            updatedFee = updatedFee + (accompningPerson * 2950)

            const updateUser = await registredUserInfo.findOneAndUpdate({_id:items._id},{$set:{registrationFee:`₹ ${updatedFee} including 18% GST`}},{new:true});
            return updateUser;
            // items["updatedFee"] = `₹ ${updatedFee} including 18% GST`
            // console.log(updatedFee,'update fee is this')
            // updatedData.push({...items._doc,updatedFee:`₹ ${updatedFee} including 18% GST`});
            
        })
    }
    catch(err){
        console.log("error updating charges.")
    }
    res.send(updatedData)
    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }
}

