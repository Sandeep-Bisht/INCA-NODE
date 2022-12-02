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
//                 user: "info@42inca.org",
//                 pass: "Giks@123",
//             },
//         });


//         let info = await transporter.sendMail({
//             from: 'info@42inca.org',
//             to: userEmail,
//             subject: "Abstract Approved for 42<sup>nd</sup>  INCA ✔",
//             html: `<div>
//             <P>
//                 Dear ${userName},<br>
//                 <p>
//                     Your Abstract is ${status} for 42<sup>nd</sup> INCA International Congress. Please pay the fee if not paid to confirm your participation the event.              
//                 </P>
//             </P>
//             <p>
//             Please contact the local organizing committee for any queries.<br>
//             Moblie Number : +91-9897038700<br>
//             Email : info@42inca.org<br>          
//             Address : National Hydrographic Office <br>
//                 107-A, Rajpur Rd,  Post Box – 75, Dehradun,<br>
//                  Uttarakhand 248001.
//             </p>
//          </div>
//          <div>
//             <p>
//                 Thank You,<br><br>
//                 Regards
//                 42 INCA<br>
//                 NHO, Dehradun
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