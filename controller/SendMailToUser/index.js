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
    console.log(counter, 'value of counter')
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
        subject: "General Information to users ✔",
        html: `
              <div>
              <P>
               <p>All participants are requested to be seated for technical sessions by 08:45am in the respective venue. The valedictory session is scheduled on 11 Nov 22 as per the timeline promulgated. It is mandatory for all participants to be available for valedictory session.</p>
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