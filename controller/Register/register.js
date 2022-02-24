const nodemailer = require("nodemailer");
var generator = require('generate-password');
let users = require('../../models/user')

var hbs = require('nodemailer-express-handlebars');


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
            from: '"Fred Foo 👻" nho@gmail.com',
            to: userEmail,
            subject: "Register for NHO event ✔",
            html: `<div>You are successfully register for our event use this password <b>${generatePassword()}</b> for login process</div>`, // html body
        });

        if (info.messageId) {
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
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


exports.register = async (req, res) => {
    let emailSendStatus;
    let { userName, userEmail, mobileNumber } = req.body
    if (userEmail && userName && mobileNumber) {
        if (await addUniqueUsers(userEmail)) {
            let user = new users({
                userName,
                userEmail,
                mobileNumber,
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
                res.send({ emailSendStatus, message: "User registred", })
            }
            catch (error) {
                res.send({ message: "Error occured while registring user", error })
            }
        }
        else {
            res.send({ message: "user is already registered with this email" })
        }
    }
    else {
        res.send({ message: "Please fill all the fields" })
    }
}


