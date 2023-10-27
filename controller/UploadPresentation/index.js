let presentation = require('../../models/presentation')

exports.uploadPresentationFiles = async (req, res) => {
    // console.log("inside upload presentation", req.body, "fileee", req.file)
    try {
        return res.send({ message: "file uploaded", data: req.file })
    }
    catch (err) {
        res.send(err)
    }
}

exports.presentation = async (req, res) => {

     const {userName, userId, registrationNumber} = req.body  
     const { filename, path, mimetype } = req.file;  
     const presentationData = new presentation({ userName, userId, registrationNumber, filename, path, mimetype });  
     try {

            let result = await presentationData.save()
            if(result){
                res.send({ message: "data saved successfully", })
            }        
           
       
    }
    catch (error) {
        console.log(error)
        res.send({ message: "Error occured while saving Presentation", error })
    }
}


exports.getPresentationById = async (req, res) => {
    
    let id = req.params.userId
    try {
        let userPresentation = await presentation.find({ userId: id })
        res.send({ data: userPresentation, message: "Request completed successfully" })
    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }
}
