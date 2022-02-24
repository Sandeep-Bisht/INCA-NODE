let users = require('../../models/user')
const nodemailer = require("nodemailer");

let url = 'https://github.com/'

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
            html: `<a href=${url}>${url}</a>`, // html body
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

exports.forgotPassword = async (req, res) => {
    let { userEmail } = req.body
    let user = await users.findOne({ userEmail })
    if (user == null) res.send({ message: "wrong email" });
    let response = await sendEmailViaSmtp(userEmail)
    res.send({ message: "reset password link is sent to your register mail" })
}


exports.verifyRegisteredEmail = async (req, res) => {
    let { userEmail } = req.body
    let user = await users.findOne({ userEmail })
    try {
        if (user == null) return res.send({ message: "Please provide registred email address", verifyEmailStatus: false })
        res.send({ verifyEmailStatus: true })
    }
    catch (err) {
        res.send(err)
    }

}

exports.changePassword = async (req, res) => {
    let { userEmail, newpassword } = req.body
    let user = await users.findOne({ userEmail })
    try {
        user.password = newpassword
        let saveEntry = await user.save()
        res.send({ message: "Password Change successfully", })
    }
    catch (err) {
        res.send(err)
    }

}