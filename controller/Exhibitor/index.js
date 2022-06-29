let saveExhibitor = require('../../models/exhibitor')

exports.saveExhibitorData = async (req, res) => {
    let exhibitorData = new saveExhibitor(req.body)
    try {
        let result = await exhibitorData.save()
       return res.send({ message: "exhibitor save successfully" })
    }
    catch (error) {
     return   res.send({ message: "Error occured while saving exhibitorsss", error })
    }
}


exports.getExhibitorData = async(req, res) => {
    try {
        let response = await saveExhibitor.find()
        res.send(response)
    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }
}