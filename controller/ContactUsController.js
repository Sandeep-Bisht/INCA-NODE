const nodemailer = require("nodemailer");
exports.contactInca = async (req, res) => {
    console.log("inside contact Inca", req.body)
    const { name, email, number, subject, message} = req.body
    try {
        let response = await sendEmailToAdmin(name, email, number, subject, message);
        if (response.messageId) {
            emailSendStatus = true;
            return res.send({ emailSendStatus ,
                message: "Thankyu for contacting." })
                   
          } else {
            // console.log("resonse", response)
            emailSendStatus = false;
            return res.send({ emailSendStatus ,
                message: "Please try again." })
          }
       
    }
    catch (error) {
     return   res.send({ message: "Error occured while saving exhibitorsss", error })
    }
}




let sendEmailToAdmin = async (name, email, number, subject, message) => {
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
        to: "info@43inca.org",
        subject: subject,
        html: `
              <div>
              <P>
                  Dear Admin,<br>
                  <p>
                  <b> ${name},tried contacting you with this email address : ${email}</b> <br/>
                    & numner : ${number}
                  for 43rd INCA International Conference.
                  </P>
                  <p> ${message}</p>
              </P>         
              
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