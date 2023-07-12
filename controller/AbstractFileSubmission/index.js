const nodemailer = require("nodemailer");
let abstractPaper = require('../../models/abstractPaper')
const userRegisteredInfo = require("../../models/registredUserInfo")


exports.uploadUserFiles = async (req, res) => {
    try {
        return res.send({ message: "file uploaded", data: req.file })
    }
    catch (err) {
        res.send(err)
    }
}

exports.saveAbstractPaper = async (req, res) => {
    const { abstractPaperName, abstractPaperDescription, mimetype, abstractFileUrl, userId, paperApproveStatus, userEmail, userName, themeType , mannualPaymentStatus} = req.body
    let result = await userRegisteredInfo.findOne({email: userEmail}, {registrationNumber: 1})
    let registrationNumber = result.registrationNumber
    let abstractData = new abstractPaper({ paperApproveStatus, abstractPaperName, abstractPaperDescription, mimetype, abstractFileUrl, userId, userEmail, userName, themeType,mannualPaymentStatus, registrationNumber})
    try {
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


exports.approveAbstractPaperByAdmin = async (req, res) => {
    
    let { docsId, paperApproveStatus } = req.body
    try {
        let userPaper = await abstractPaper.findById(docsId)
        userPaper.paperApproveStatus = paperApproveStatus
        let abstractData = new abstractPaper(userPaper)
        let result = await abstractData.save();
        if(paperApproveStatus){
            var emailResponse = await sendEmailViaSmtp(userPaper.userName, userPaper.userEmail, "Approved")
        }
        else {
            var emailResponse = await sendEmailViaSmtp(userPaper.userName, userPaper.userEmail, "Reject")
        }
        
        if (emailResponse.messageId) {
            res.send({ message: "Email is sent on your registred mail. Please check your email for further process", })
        }

    } catch (error) {

        res.send({ message: "Error occured while fetching records" })
    }
}

// let sendEmailViaSmtp = async (userName, userEmail, status) => {
//     try {
//         let transporter = nodemailer.createTransport({
//             host: "smtp.gmail.com",
//             port: 587,
//             secure: false,
//             auth: {
//                 user: "info@43inca.org",
//                 pass: "Inca@0623",
//             },
//         });


//         let info = await transporter.sendMail({
//             from: 'info@43inca.org',
//             to: userEmail,
//             subject: "Abstract Approved for 43 rd INCA ✔",
//             html: `<div>
//             <P>
//                 Dear ${userName},<br>
//                 <p>
//                     Your Abstract is ${status} for 43<sup>rd</sup> INCA International Congress. Please pay the fee if not paid to confirm your participation the event.              
//                 </P>
//             </P>
//             <p>
//             Please contact the local organizing committee for queries.<br>
            // Organising Secretary<br>
            // Moblie Number : 91 291 2796400<br>
            // Email : info@43inca.org<br>          
            // Address : Regional Remote Sensing Centre-West, NRSC/ISRO<br>
            // ISRO Complex, Bypass Road<br>
            // Sector 9, Kudi Bhagtasani Housing Board (KBHB)<br>
            // Jodhpur - 342 005, Rajasthan, India
//             </p>
//          </div>
//          <div>
//             <p>
//                 Thank You,<br><br>
//                 Regards
//                 43 INCA<br>
//                 ISRO, Jodhpur
//             </p>
//          </div>
//          <div>
//             <p>
//             *This is a system genrated email, please do not reply on this email.
//             </p>
//          </div>`, // html body
//         });

//         if (info.messageId) {
//             return info
//         }
//     }
//     catch (err) {
//         return err
//     }
// }