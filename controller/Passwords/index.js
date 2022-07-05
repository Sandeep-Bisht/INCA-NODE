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
            subject: "Register for NHO event ✔",
            html: `<div>
            <P>
                Dear ${userName},<br>
                <p>
                Please use the new password for login on 42<sup>nd</sup> INCA International Congress.                
                </P>
            </P>
             <p>
                Password : ${password}</b>
            </p>
            <p>
            Please contact the local organizing committee for queries.<br>
            Moblie Number : 9897038700<br>
            Email : info@42inca.org<br>          
            Address : National Hydrographic Office <br>
                107-A, Rajpur Rd, Post Box – 75, Dehradun,<br>
                 Uttarakhand 248001.
            </p>
         </div>
         <div>
            <p>
                Thank You,<br><br>
                Regards
                42 INCA<br>
                NHO, Dehradun
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
    let userObj = await users.findOne({ userEmail })
    if (userObj == null) return res.send({ message: "Please send the registred email address" });
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




