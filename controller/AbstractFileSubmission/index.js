const nodemailer = require("nodemailer");
let abstractPaper = require('../../models/abstractPaper')
let onlyAbstractFile = require('../../models/onluAbstractFile')
const userRegisteredInfo = require("../../models/registredUserInfo")


exports.uploadUserFiles = async (req, res) => {
    try {
        return res.send({ message: "file uploaded", data: req.file })
    }
    catch (err) {
        res.send(err)
    }
}

exports.saveOnlyAbstractFile = async (req, res) => {    
    
    console.log("inside save abstract file only", req.body)
    const { userName,userEmail, mimetype, abstractPaperFileUrl, userId, paperApproveStatus,  mannualPaymentStatus} = req.body
    let result = await userRegisteredInfo.findOne({email: userEmail}, {registrationNumber: 1})
    let registrationNumber = result?.registrationNumber

    let abstractFileData = new onlyAbstractFile({ userName,mimetype, abstractPaperFileUrl, userId, paperApproveStatus, mannualPaymentStatus, registrationNumber})
    try {

        let lastRecord = await getLastRecordFromOnlyAbstractFileTable(userEmail)
    if(lastRecord  && lastRecord.abstractNumber != undefined){
        let val =  parseInt(lastRecord.abstractNumber.split("F")[1]) + 1
        abstractFileData.abstractNumber = `43IAF${val.toString().padStart(5, '0')}`;
        // info.abstractNumber = `43IA${val}`
    }
    else {
        abstractFileData.abstractNumber = "43IAF0005"
    }
        let result = await abstractFileData.save()
       
        res.send({ message: "data saved successfully", })
    }
    catch (error) {
        res.send({ message: "Error occured while saving sponsor", error })
    }
}

exports.saveAbstractPaper = async (req, res) => {    
    
    const { userName, authorSaluation, authorFirstName, authorMiddleName,abstractPaperFileUrl, authorLastName, authorEmail,userEmail, authorAffiliation, coAuthorDetails, abstractPaperName, mimetype, abstract, userId, paperApproveStatus, paperPresentationType, themeType , mannualPaymentStatus} = req.body
    let result = await userRegisteredInfo.findOne({email: userEmail}, {registrationNumber: 1})
    let registrationNumber = result?.registrationNumber

    let abstractData = new abstractPaper({ userName,userEmail,authorSaluation,abstractPaperFileUrl, authorFirstName, authorMiddleName,authorLastName, authorEmail, authorAffiliation, coAuthorDetails, abstractPaperName, mimetype, abstract, userId, paperApproveStatus,paperPresentationType, themeType, mannualPaymentStatus, registrationNumber})
    try {

        let lastRecord = await getLastRecordFromTable(userEmail)
    if(lastRecord  && lastRecord.abstractNumber != undefined){
        let val =  parseInt(lastRecord.abstractNumber.split("A")[1]) + 1
        abstractData.abstractNumber = `43IA${val.toString().padStart(4, '0')}`;
        // info.abstractNumber = `43IA${val}`
    }
    else {
        abstractData.abstractNumber = "43IA0005"
    }
        let result = await abstractData.save()
       
        res.send({ message: "data saved successfully", })
    }
    catch (error) {
        res.send({ message: "Error occured while saving sponsor", error })
    }
}

exports.getAbstractPaper = async (req, res) => {
    try {
        let response = await abstractPaper.find()
        return res.send(response)
    }
    catch (error) {
        return res.send({ message: "Error occured while fetching records" })
    }
}


exports.getAbstractPaperById = async (req, res) => {
    let id = req.params.userId
    try {
        let userPaper = await abstractPaper.find({ userId: id })
        res.send({ data: userPaper, message: "Request completed successfully" })
    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }
}

exports.deleteAbstractPaper = async (req, res) => {
   
    let id = req.params.abstractId
    try {
        let response = await abstractPaper.deleteOne({_id : id})
        if(response){
            res.send({ message : "Abstract deleted"})
        }
        
    } catch (error) {
        res.send({ message: "Error occured while deleting Abstract" })
    }
    // db.your_collection.deleteOne({ _id: ObjectId("your_object_id_here") });
}


exports.approveAbstractPaperByAdmin = async (req, res) => {
    // console.log("inside approve abstarct", req.body)
    let { docsId, paperApproveStatus } = req.body
    try {
        let userPaper = await abstractPaper.findById(docsId)
        userPaper.paperApproveStatus = paperApproveStatus
        // console.log("inside userPaper abstarct", userPaper)
        let abstractData = new abstractPaper(userPaper)
        let result = await abstractData.save();
        if(paperApproveStatus){
            var emailResponse = await sendEmailViaSmtp(userPaper.userName, userPaper.authorEmail, "Approved")
            if (emailResponse.messageId ) {
                res.send({ status : "Approved",
                 message: "Email is sent on your registred mail. Please check your email for further process", })
            }
        }
        else {
            var emailResponse = await sendEmailViaSmtp(userPaper.userName, userPaper.userEmail, "Rejected")
            if (emailResponse.messageId ) {
                res.send({ status : "Rejected",
                    message: "Email is sent on your registred mail. Please check your email for further process", })
            }
        }
        
        

    } catch (error) {

        res.send({ message: "Error occured while fetching records" })
    }
}

let sendEmailViaSmtp = async (userName, userEmail, status) => {
    // console.log("inside send email",userName, userEmail,status)
    try {
        let transporter = nodemailer.createTransport({
            host: "smtpout.secureserver.net",
            port: 587,
            secure: false,
            auth: {
                user: "info@43inca.org",
                pass: "Inca@0623",
            },
            tls: { rejectUnauthorized: false },
        });


        let info = await transporter.sendMail({
            from: 'info@43inca.org',
            to: userEmail,
            subject: "Abstract Approved for 43 rd INCA ✔",
            html: `<div>
            <P>
                Dear ${userName},<br>
                <p>
                    Your Abstract is ${status} for 43<sup>rd</sup> INCA International Congress. Please pay the fee if not paid to confirm your participation the event.              
                </P>
            </P>
            <p>
            Please contact the local organizing committee for queries.<br>
            Organising Secretary<br>
            Moblie Number : 91 291 2796395<br>
            Email : info@43inca.org<br>          
            Address : Regional Remote Sensing Centre-West, NRSC/ISRO<br>
            ISRO Complex, Bypass Road<br>
            Sector 9, Kudi Bhagtasani Housing Board (KBHB)<br>
            Jodhpur - 342 005, Rajasthan, India
            </p>
         </div>
         <div>
            <p>
                Thank You,<br><br>
                Regards
                43 INCA<br>
                ISRO, Jodhpur
            </p>
         </div>
         <div>
            <p>
            *This is a system generated email, please do not reply on this email.
            </p>
         </div>`, // html body
        });

        if (info.messageId) {
            return info
        }
    }
    catch (err) {
        return err
    }
}

let getLastRecordFromTable = async () => {
    let response = await abstractPaper.findOne().sort({"_id":-1}).limit(1)
    return response
}

let getLastRecordFromOnlyAbstractFileTable = async () => {
    let response = await onlyAbstractFile.findOne().sort({"_id":-1}).limit(1)
    return response
}

