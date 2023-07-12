const Razorpay = require('razorpay')
const nodemailer = require("nodemailer");
var generator = require('generate-password');
let users = require('../../models/user');
let payment = require('../../models/paymentinfo')
const userRegisteredInfo = require("../../models/registredUserInfo")

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
                user: "info@43inca.org",
                pass: "Inca@0623",
            },
        });


        let info = await transporter.sendMail({
            from: 'info@43inca.org',
            to: userEmail,
            subject: "Register for 43 rd INCA event ✔",
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

exports.paymentIntegration = async(req, res) => {
    
    try {
        let info = new userRegisteredInfo(req.body)
        let saveEntry = await info.save()

        const rzp = new Razorpay({
        key_id: "rzp_test_fXDarHzcgxICzG",
        key_secret: "3vyGds9UfapZwfCt4LPFyzVz",
    })

    const rzpOrder = await rzp.orders.create({
        amount: req.body.registrationFee * 100, 
        currency: 'INR',
        receipt: "receipt#1"
    })
        
    if(req.body.systemRole == "admin"){
        let result =   register(req.body.name, req.body.email, req.body.phoneNumber, "user")
        res.status(201).json({success:true, rzpOrder, message:"user saved", userRegistrationMessage:"Password has been sent successfully to entred email for login"})
    }
    res.status(201).json({success:true, rzpOrder})
    }
    catch (error) {
        res.send(error)
    }  
}