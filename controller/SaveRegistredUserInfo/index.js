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
                let response = await sendEmailViaSmtp(userEmail, userEmail, user.password)
                if (response.messageId) {
                    emailSendStatus = true
                }
                else {
                    emailSendStatus = false
                }
                return   "User registred"
            }
            catch (error) {
               return  "Error occured while registring user"
            }
        }
        else {
           return  "user is already registered with this email" 
        }
}



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
        from: "info@42inca.org",
        to: userEmail,
        subject: "Register for NHO event ✔",
        html: `
              <div>
              <P>
                  Dear ${userName},<br>
                  <p>
                  Thank you for creating your login credentials for 42nd INCA International Confernce.
                  </P>
              </P>
               <p>
               Please use the following credentials to log in and complete your registration.<br>
                  <b>Username : ${userEmail} <br>
                  Password : ${password}</b>
              </p>
              <p>
              Please contact the local organizing committee for any queries.<br>
              Mobile Number : 9897038700<br>
              Email : mailto:info@42inca.org<br>          
              Address : National Hydrographic Office <br>
                  107-A, Rajpur Rd, Hathibarkala Salwala, Dehradun,<br>
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
        if(req.body.systemRole == "admin"){
            let result =  await register(req.body.name, req.body.email, req.body.phoneNumber, "user")
            if(result !== "user is already registered with this email"){
                let saveEntry = await info.save()
                return res.send({message:"data saved", userRegistrationMessage:"Password has been sent successfully to entred email for login"})
            }
            else {
                return res.send({message:"User is already registred with this mail."})
            }
        }
        else {
            let saveEntry = await info.save()
        }
        res.send({message:"data saved"})
    }
    catch (error) {
        res.send({ message: "Error occured while saving user info", error })
    }
}




