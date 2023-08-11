const nodemailer = require("nodemailer");
var generator = require('generate-password');
let users = require('../../models/user');

let generatePassword = () => {
    let password = generator.generate({
        length: 10,
        numbers: true
    });
    return password
}

let sendEmailViaSmtp = async (userName, userEmail, password) => {
    console.log("inside emailll", userName, userEmail, password)
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
            subject: "New Password for 43 rd INCA event ✔",
            html: `<div>
            <P>
                Dear ${userName},<br>
                <p>
                Please use the new password for login on 43<sup>nd</sup> INCA International Congress.                
                </P>
            </P>
             <p>
                Password : ${password}</b>
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
                Thank You,<br><br>
                Regards
                43 INCA<br>
                ISRO, Jodhpur
            </p>
         </div>
         <div>
            <p>
            *This is a system genrated password, please do not delete this for future reference and do not reply on this email.
            </p>
         </div>`, // html body
        });

        if (info.messageId) {
            return info
        }
    }
    catch (err) {
        return err
    }
}


exports.forgotPassword = async (req, res) => {
    
    let { userEmail } = req.body
    console.log("inside forgot password",userEmail)
    let userObj = await users.findOne({ userEmail })
    if (userObj == null) return res.send({ message: "Please enter registred email address" });
    userObj.password = generatePassword()
    let result = await sendEmailViaSmtp(userObj.userName, userObj.userEmail, userObj.password)
    let user = new users(userObj)
    if (result.messageId) {
        let saveEntry = await user.save()
        res.send({ message: "Password has been successfully sent to your registred email, please check your registred email for Credentials.", })
    }
    else {
        res.send({message:"Error while sending the new password."})
    }

}




