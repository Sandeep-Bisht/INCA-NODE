let registredUserInfo = require('../../models/registredUserInfo')
// abstractpapers
let abstractPaper = require('../../models/abstractPaper')
const nodemailer = require("nodemailer");

exports.getUserInfoForCertificate = async(req, res) => {
    var email = req.params.id;
    try {
        let user = await abstractPaper.find({userEmail:email})
        let response = await registredUserInfo.find({email:email});
        // let userName = "Dr. Sucheta Mukherjee";
        // let designation = "Kalyani University"
        // let abstractPaperName = "An assessment of water quality of Bhagirathi river using geospatial techniques for Murshidabad District, India";
        let newResponse = {
          // userName,
          userName:user.length > 0  ? user[0].userName : response[0].name ,
          abstractPaperName:user.length > 0  ? user[0].abstractPaperName : "",
          // abstractPaperName,
          // designation
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
        subject: "certificate for 43 rd INCA event ✔",
        html: `
              <div>
              <P>
                Dear ${userName},<br>
                <a href="http://localhost:3000/certificate/${userEmail}">Please click the and download the your certificate</a>
              </p>
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
                  43 INCA<br>
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
  };