let abstractPaper = require('../../models/abstractPaper')

exports.uploadUserFiles = async (req, res) => {
    console.log(req.file, 'valueeee')
    try {
       return res.send({message:"file uploaded", data:req.file})
    }
    catch(err){
        res.send(err)
    }
}

exports.saveAbstractPaper = async(req, res) => {
   const {abstractPaperName, abstractPaperDescription, mimetype, abstractFileUrl, userId} =  req.body
    let abstractData = new abstractPaper({abstractPaperName, abstractPaperDescription, mimetype, abstractFileUrl, userId})
    try {
        let ressult = await abstractData.save()
        res.send({ message: "data saved successfully", })
    }
    catch (error) {
        res.send({ message: "Error occured while saving sponsor", error })
    }
}

exports.getAbstractPaper = async(req, res) => {
    try {
        let response = await abstractPaper.find()
        return res.send(response)
    } 
    catch (error) {
      return res.send({ message: "Error occured while fetching records" })
    }
}