let sponsor = require('../../models/sponser')

exports.saveSponsor = async (req, res) => {
    let sponsorData = new sponsor(req.body)
    try {
        let saveSponsor = await sponsorData.save()
        res.send({ message: "sponsor save successfully", })
    }
    catch (error) {
        res.send({ message: "Error occured while saving sponsor", error })
    }
}

exports.getSponsors = async(req, res) => {
    try {
        let response = await sponsor.find()
        res.send(response)

    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }
}