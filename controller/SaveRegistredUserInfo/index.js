const nodemailer = require("nodemailer");
var generator = require('generate-password');
let users = require('../../models/user')
const userRegisteredInfo = require("../../models/registredUserInfo")




// method for rigister user when admin fills the user form


let register = async (userName, userEmail, mobileNumber, role) => {
    let emailSendStatus;
        if (await addUniqueUsers(userEmail)) {
            let user = new users({
                userName,
                userEmail,
                mobileNumber,
                role,
                password: generatePassword()
            })
            try {
                let saveEntry = await user.save()
                let response = await sendEmailViaSmtp(userEmail)
                if (response.messageId) {
                    emailSendStatus = true
                }
                else {
                    emailSendStatus = false
                }
                return { emailSendStatus, message: "User registred", }
            }
            catch (error) {
               return { message: "Error occured while registring user", error }
            }
        }
        else {
           return { message: "user is already registered with this email" }
        }
}



let generatePassword = () => {
    let password = generator.generate({
        length: 10,
        numbers: true
    });
    return password
}

let sendEmailViaSmtp = async (userEmail) => {
    let testAccount = await nodemailer.createTestAccount();
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });


        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" mailto:nho@gmail.com',
            to: userEmail,
            subject: "Register for NHO event ✔",
            html: `<div>You are successfully register for our event use this password <b>${generatePassword()}</b> for login process</div>`, // html body
        });

        if (info.messageId) {
            return info
        }
    }
    catch (err) {
        return err
    }
}

let addUniqueUsers = async (userEmail) => {
    const res = await users.findOne({ userEmail: userEmail })
    if (res !== null) {
        return false
    }
    return true
}

exports.saveRegistredUserInfo = async (req, res) => {
    let info = new userRegisteredInfo(req.body)
    try {
        let saveEntry = await info.save() 
        if(req.body.systemRole == "admin"){
            let result =   register(req.body.name, req.body.email, req.body.phoneNumber, "user")
           return res.send({message:"data saved", userRegistrationMessage:"Password has been sent successfully to entred email for login"})
        }
        res.send({message:"data saved"})
    }
    catch (error) {
        res.send({ message: "Error occured while saving user info", error })
    }
}




