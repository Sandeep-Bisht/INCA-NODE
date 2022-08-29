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
     const { fullPaperName, mimetype, fullPaperFileUrl, themeType, userId, userEmail, userName} = req.body
     let result = await userRegisteredInfo.findOne({email: userEmail}, {registrationNumber: 1})
     let registrationNumber = result.registrationNumber;
    let fullPaperData = new fullPaper({ fullPaperName, mimetype, fullPaperFileUrl, themeType, userId, userEmail, userName,  registrationNumber})        
     try {
        let result = await fullPaperData.save()
        res.send({ message: "data saved successfully", })
    }
    catch (error) {
        res.send({ message: "Error occured while saving Fullpaper", error })
    }
}

exports.getFullPaper = async (req, res) => {
    
    try {
        let response = await fullPaper.find()
        
        return res.send(response)
        
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