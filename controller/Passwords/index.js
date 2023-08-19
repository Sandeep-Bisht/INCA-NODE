const nodemailer = require("nodemailer");
var generator = require('generate-password');
var jwt = require('jsonwebtoken');
let users = require('../../models/user');
const { Error } = require("mongoose");

let generatePassword = () => {
    let password = generator.generate({
        length: 10,
        numbers: true
    });
    return password
}

let sendEmailViaSmtp = async (userName, userEmail, token) => {
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
            subject: "Reset Password for 43 rd INCA event ✔",
            html: `<div>
            <P>
                Dear ${userName},<br>
                <p>
                Please click the below link to create new password for  43<sup>rd</sup> INCA International Congress. 
                           
                </P>
                <p>${`https://43inca.org/reset-password/${token}`}</p>
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
                Thank You,<br><br>
                Regards
                43 INCA<br>
                ISRO, Jodhpur
            </p>
         </div>
         <div>
            <p>
            *This is a system generated password, please do not delete this for future reference and do not reply on this email.
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

function generateAccessToken(userEmail) {
    return jwt.sign({ userEmail }, "6210607b75c134501baa290c", { expiresIn: '1000s' });
}


exports.forgotPassword = async (req, res) => {
    try {
        const { userEmail } = req.body;
        const userObj = await users.findOne({ userEmail });

        if (!userObj) {
            return res.send({ message: "Please enter a registered email address" });
        }
        
        const token = generateAccessToken({ userEmail});
        userObj.token = token; // Update the token in the user document
        await userObj.save(); // Save the updated user document
         const checkUser = await users.findOne({ userEmail });
        // console.log("checkUser ", checkUser)

        const result = await sendEmailViaSmtp(userObj.userName, userObj.userEmail, token);
        if (result.messageId) {
            res.send({ token, message: "Password reset link has been sent successfully" });
        } else {
            res.send({ message: "Error while sending the password reset link." });
        }
    } catch (error) {
        // console.log("error", error)
        res.status(500).send({ message: "Internal server error" });
    }
};




exports.resetPassword = async (req, res) => {
    const { password, token } = req.body;
    
    try {
        const decoded = jwt.verify(token.id, "6210607b75c134501baa290c");
        // console.log("deocde", decoded)
        let userEmail = await  decoded.userEmail.userEmail;
        const user = await users.findOne({ userEmail });
            user.password = password
          let result =await user.save()
        // Continue with your reset password logic using the decoded payload
        // For example, update the user's password in the database
        // ...

        // Send a response indicating success
        if(result){
            res.send({ message: "Password reset successful." });
        }        
    } catch (error) {
        // console.log("error", error)
        res.status(400).send({ message: "Invalid token or token has expired." });
    }
};





