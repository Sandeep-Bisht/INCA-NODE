let fullPaper = require('../../models/fullPaper')
const userRegisteredInfo = require("../../models/registredUserInfo")

exports.uploadUserFullPaperFiles = async (req, res) => {
    try {
        return res.send({ message: "file uploaded", data: req.file })
    }
    catch (err) {
        res.send(err)
    }
}

exports.saveFullPaper = async (req, res) => {
     const {userName, authorSaluation, authorFirstName, authorMiddleName,authorLastName, authorEmail, authorAffiliation, coAuthorDetails, paperPresentationType, fullPaperName, mimetype, fullPaperFileUrl, themeType, userId, userEmail} = req.body
     let result = await userRegisteredInfo.findOne({email: userEmail}, {registrationNumber: 1})
     let registrationNumber = result?.registrationNumber;
    let fullPaperData = new fullPaper({userName, authorSaluation, authorFirstName, authorMiddleName,authorLastName, authorEmail, authorAffiliation, paperPresentationType, coAuthorDetails, fullPaperName, mimetype, fullPaperFileUrl, themeType, userId,  registrationNumber})        
     try {

            let lastRecord = await getLastRecordFromTable(authorEmail)
    if(lastRecord  && lastRecord.fullPaperNumber != undefined){
        let val =  parseInt(lastRecord.fullPaperNumber.split("F")[1]) + 1
        fullPaperData.fullPaperNumber = `43IF${val.toString().padStart(4, '0')}`;
        // info.abstractNumber = `43IF${val}`
    }
    else {
        fullPaperData.fullPaperNumber = "43IF0005"
    }
        let result = await fullPaperData.save()
        res.send({ message: "data saved successfully", })
    }
    catch (error) {
        console.log(error)
        res.send({ message: "Error occured while saving Fullpaper", error })
    }
}

exports.getFullPaper = async (req, res) => {
    
    try {
        let response = await fullPaper.find()
        return res.send(response);
    }
    catch (error) {
        return res.send({ message: "Error occured while fetching records" })
    }
}


exports.getFullPaperById = async (req, res) => {
    let id = req.params.userId
    try {
        let userPaper = await fullPaper.find({ userId: id })
        res.send({ data: userPaper, message: "Request completed successfully" })
    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }
}

let getLastRecordFromTable = async () => {
    let response = await fullPaper.findOne().sort({"_id":-1}).limit(1)
    return response
}