let transactionDetails = require('../../models/transactionDetails')
const userRegisteredInfo = require("../../models/registredUserInfo")
const nodemailer = require("nodemailer");
const QRCode = require('qrcode');
const Jimp = require("jimp");
let sendEmailViaSmtp = async (userName, userEmail, qr) => {
    let res = qr.split('/')
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
            subject: "QR for 43 rd INCA ✔",
            html: `<div>
            <P>
            Dear ${userName},<br>
            <p>Please bring this attached QR code in any readable format at the congress venue for your convenience.</p>
        </P>
        <img src="cid:hello@123"/>
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
            <div>
            <p>
                Thank You,<br><br>
                Regards
                43 INCA<br>
                ISRO, Jodhpur
            </p>
         </div>
          
         </div>`, 
         attachments: [{
            filename: res[1],
            path: `http://144.91.110.221:4801/${qr}`,
            cid: "hello@123" //same cid value as in the html img src
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
    if(result == null){
        response["mannualPaymentStatus"] = "paid"
        response['attendanceStatus'] = true;
    }
    else {
        result.mannualPaymentStatus = "paid"
        response.mannualPaymentStatus = "paid"
        response.attendanceStatus = true;
    }
    
    try {
        if(result == null){
            let data1 = await response.save()
        }
        else {
            let data = await result.save()
            let data1 = await response.save()
        }
    
        let emailResponse = await senPaymentConfirmationEmailToUser(response.name, response.email, response.transactionNumber)
        if (emailResponse.messageId) {
            emailSendStatus = true;
        } else{
            emailSendStatus = false;
        }
        res.send({
            emailSendStatus,
            message:
              "Payment Status Approved.",
          });
    }
    catch (error) {
        return res.send({ message: "Error occured while Approving payment  ", error })
    }
}


let generateQrOnPaymentApproval = async (val) => {
    let fileName;
    fileName = `qrimages/${val.name}.jpg`
    let qrInfo = `http://43inca.org/userinfo/${val.userId}`;
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

let senPaymentConfirmationEmailToUser = async (userName ,userEmail, transactionId) => {
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
          from: "info@43inca.org",
          to: userEmail,
          subject: "Payment Confirmation for 43rd INCA event ✔",
          html: `
                <div>
                <P>
                    Dear ${userName},<br>
                    <p>
                    We have Recived a Payment with Transaction Id : ${transactionId}, for 43rd INCA International Conference.
                    You can now submit your  Paper presentation.
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
                Thanks & Regards,<br>
                    43rd INCA<br>
                    ISRO, Jodhpur
                </p>
             </div>
             <div>
                <p>
                    This is system generated email. Please do not reply to this. 
                </p>
             </div>
                 `,
        });
    
        if (info.messageId) {
          return info;
        }
      } catch (err) {
        return err;
      }
}