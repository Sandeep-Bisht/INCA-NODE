let transactionDetails = require('../../models/transactionDetails')
const userRegisteredInfo = require("../../models/registredUserInfo")
const nodemailer = require("nodemailer");
const QRCode = require('qrcode');
const Jimp = require("jimp");

let sendEmailViaSmtp = async (userEmail, userName, qr) => {
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
            subject: "Confirmation for 42<sup>nd</sup>  INCA ✔",
            html: `<div>
            <P>
            Dear ${userName},<br>
            <p>Please bring this attached QR code in any readable format at the congress venue for your convenience.</p>
        </P>
        <img src="cid:${res[1]}"/>
        <p>
            Please contact the local organizing committee for queries.<br>
            Moblie Number : 9897038700<br>
            Email : info@42inca.org<br>          
            Address : National Hydrographic Office <br>
                107-A, Rajpur Rd, Post Box – 75, Dehradun,<br>
                 Uttarakhand 248001.
            </p>
            <div>
            <p>
                Thank You,<br><br>
                Regards
                42 INCA<br>
                NHO, Dehradun
            </p>
         </div>
          
         </div>`, 
         attachments: [{
            filename: res[1],
            path: `/${qr}`,
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
    response.attendanceStatus = true;
    try {
        let data = await result.save()
        let data1 = await response.save()
        res.send({ message: "Payment Status Approved." })
    }
    catch (error) {
        return res.send({ message: "Error occured while Approving payment  ", error })
    }
}


let generateQrOnPaymentApproval = async (val) => {
    let fileName;
    fileName = `qr/${val.name}1.jpg`
    let qrInfo = `http://42inca.org/userinfo/${val.userId}`;
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

exports.sendQrCodeToUserOnEmail = async(req, res) => {
    let id = req.params.id;
     let response = await userRegisteredInfo.findOne({ userId:id })
     let qrResult = await generateQrOnPaymentApproval(response)
    let emailResponse = await sendEmailViaSmtp(response.name, response.email, qrResult);
    console.log(emailResponse, 'emailResponseee1')
    if(emailResponse && emailResponse.messageId){
        res.send({message:"QR sent to user successfully"})
    }
    else {
        res.send({message:"Error while sending email"})
    }
}

exports.getUserInfoForQr = async(req, res) => {
    var id = req.params.id;
    try {
        let user = await userRegisteredInfo.find({userId:id})
        res.send(user)
    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }
} 