const fs = require("fs");
let transactionDetails = require('../../models/transactionDetails')
const userRegisteredInfo = require("../../models/registredUserInfo")
let abstractPaper = require('../../models/abstractPaper')
const nodemailer = require("nodemailer");
const QRCode = require('qrcode');
const Jimp = require("jimp");

let sendEmailViaSmtp = async (userEmail, qr) => {
    let res = qr.split('/')
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "info@42inca.org",
                pass: "Giks@123",
            },
        });


        let info = await transporter.sendMail({
            from: 'info@42inca.org',
            to: userEmail,
            subject: "Abstract Approved for 42<sup>nd</sup>  INCA ✔",
            html: `<div>
            <a href="http://144.91.110.221:4801/${qr}">view Image1</a>
           <img src="http://144.91.110.221:4801/cid:${res[1]}"/>
         </div>`, // html body
         attachments: [{
            filename: res[1],
            path: qr,
            cid: res[1] //same cid value as in the html img src
        }]
        });

        if (info.messageId) {
            return info
        }
    }
    catch (err) {
        return err
    }
}

exports.updateFeeManuallyByAdmin = async (req, res) => {
    let id = req.params.id;
    let result = await transactionDetails.findOne({ registrationNumber: id })
    let response = await userRegisteredInfo.findOne({ registrationNumber: id })
    result.mannualPaymentStatus = "paid"
    response.mannualPaymentStatus = "paid"
    try {
        let data = await result.save()
        let data1 = await response.save()
        let qrResult = await generateQrOnPaymentApproval(response)
        let emailResponse = await sendEmailViaSmtp(response.email, qrResult);
        res.send({ message: "Payment Status Approved." })
    }
    catch (error) {
        return res.send({ message: "Error occured while Approving payment  ", error })
    }
}

let generateQrOnPaymentApproval = async (val) => {
    let fileName;
    fileName = `qr/${val.name}.jpg`
    let qrInfo = `Participant name is ${val.name} Registration number is ${val.registrationNumber} Transaction number is ${val.transactionNumber} Participant address is ${val.address} Participant email is ${val.email} Nationality is ${val.nationality} Participation Type is ${val.participationType} Participant Contact no ${val.phoneNumber}  Registration fee is ${val.registrationFee} Bank name is ${val.bankName} Account no is${val.accountNumber}`
    QRCode.toDataURL(qrInfo).then(url => {
        let res = url.split(",")
        const buffer = Buffer.from(res[1], "base64");
        Jimp.read(buffer, (err, res) => {
            if (err) throw new Error(err);
            res.quality(5).write(fileName);
        });       
    }).catch(err => {
        console.debug(err)
    })
    return fileName;
}