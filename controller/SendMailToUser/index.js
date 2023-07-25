let registredUserInfo = require('../../models/registredUserInfo')

const nodemailer = require("nodemailer");

let counter = 0;
exports.sendEmailToAllUsers = async(req, res) => {
    var email = req.params.id;
    try {
        let result = await sendEmailViaSmtp(email);    
          if(result.messageId){
            res.send({message:`Email send to user successfully`})
          }
          else {
            res.send({message:`Email address is not valid`})
          }
    }
     catch (error) {
        res.send({ message: "Error occurs while sending email" })
    }
}


let sendEmailViaSmtp = async (userEmail) => {
    try {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "info@43inca.org",
          pass: "Inca@0623",
        },
      });
  
      let info = await transporter.sendMail({
        from: "info@43inca.org",
        to: userEmail,
        subject: "General Information to users ✔",
        html: `
              <div>
              <P>
               <p>All participants are requested to be seated for technical sessions by 08:45am in the respective venue. The valedictory session is scheduled on 11 Nov 22 as per the timeline promulgated. It is mandatory for all participants to be available for valedictory session.</p>
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