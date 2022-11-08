let registredUserInfo = require('../../models/registredUserInfo')
// abstractpapers
let abstractPaper = require('../../models/abstractPaper')
const nodemailer = require("nodemailer");

exports.getUserInfoForCertificate = async(req, res) => {
    var email = req.params.id;
    try {
        let user = await abstractPaper.find({userEmail:email})
        let response = await registredUserInfo.find({email:email})
        let newResponse = {
          userName:user[0].userName,
          abstractPaperName:user[0].abstractPaperName,
          designation:response[0].designation
        }
        let arr = [];
        arr.push(newResponse)
        res.send(arr)
    } catch (error) {
        res.send({ message: "Error occured while fetching records" })
    }
} 

exports.sendEmailToUserForDownloadCertificate = async(req, res) => {
    var id = req.params.id;
    try {
        let user = await registredUserInfo.find({registrationNumber:id})
       let result = await sendEmailViaSmtp(user[0].name, user[0].email, user[0].registrationNumber)
       if(result.messageId){
            res.send({message:"Email sent successfully"})
       } 
    } catch (error) {
        res.send({ message: "Error occurs while sending email" })
    }
}


let sendEmailViaSmtp = async (userName, userEmail, registrationNumber) => {
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
        from: "info@42inca.org",
        to: userEmail,
        subject: "Register for NHO event ✔",
        html: `
              <div>
              <P>
                Dear ${userName},<br>
                <a href="http://42inca.org/certificate/${userEmail}">Please click the and download the your certificate</a>
              </p>
              <p>
              Please contact the local organizing committee for any queries.<br>
              Mobile Number : 9897038700<br>
              Email : mailto:info@42inca.org<br>          
              Address : National Hydrographic Office <br>
                  107-A, Rajpur Rd, Post Box – 75, Dehradun,<br>
                   Uttarakhand 248001.
              </p>
           </div>
           <div>
              <p>
              Thanks & Regards,<br>
                  42 INCA<br>
                  NHO, Dehradun
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
  };