let registredUserInfo = require('../../models/registredUserInfo')
let users = require('../../models/user')
let sponsor = require('../../models/sponser')

exports.getCounters = async (req, res) => {
    let userCount = await users.count()
    let registredUserInforCount = await registredUserInfo.count()
    let presentCount =  await registredUserInfo.find({attendanceStatus:true}).count()
    let sponserCount = await sponsor.count()
    let response = [{
        type: "user",
        counter: 0,
    },
    {
        type: "sponser",
        counter: 0,

    },
    {
        type: "registred",
        counter: 0,

    },
    {
        type:"present",
        counter:0
    },
    
    ]
    try {
        if (userCount > -1) {
            response[0].counter = userCount
        }

        if (sponserCount > -1) {
            response[1].counter = sponserCount
        }

        if (registredUserInforCount > -1) {
            response[2].counter = registredUserInforCount
        }

        if (presentCount > -1) {
            response[3].counter = presentCount
        }

        res.send({ response })
    }
    catch (err) {
        res.send("Something went wrong")
    }
}