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
        to: userEmail,
        subject: "Register for 43 rd INCA event ✔",
        html: `
              <div>
              <P>
                  Dear ${userName},<br>
                  <p>
                  Thank you for creating your login credentials for 43rd INCA International Conference.
                  </P>
              </P>
               <p>
               Please use the following credentials to log in and complete your registration.<br>
                  <b>Username : ${userEmail} <br>
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
              Thanks & Regards,<br>
                  43 INCA<br>
                  ISRO, Jodhpur
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
    let { name, email} = req.body;
    let info = new userRegisteredInfo(req.body)
    let result = await getLastRecordFromTable()
    if(result  && result.registrationNumber != undefined){
        let val =  parseInt(result.registrationNumber.split("A")[1]) + 1
        info.registrationNumber = `INCA${val}`
    }
    else {
        info.registrationNumber = "INCA105"
    }
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
            // let response = await sendEmailAfterRegisterViaSmtp(name, email)
            // if (response.messageId) {
            //     emailSendStatus = true
            // }
            // else {
            //     emailSendStatus = false
            // }

        }
        res.send({message:"data saved",
        // emailSendStatus
    })
    }
    catch (error) {
        res.send({ message: "Error occured while saving user info", error })
    }
}

let getLastRecordFromTable = async () => {
    let response = await userRegisteredInfo.findOne().sort({"_id":-1}).limit(1)
    return response
}


// let sendEmailAfterRegisterViaSmtp = async (name, email) => {
//     try {
//         let transporter = nodemailer.createTransport({
//             host: "smtpout.secureserver.net",
//             port: 587,
//             secure: false,
//             auth: {
//                 user: "info@43inca.org",
//                 pass: "Inca@0623",
//             },
//             tls: { rejectUnauthorized: false },
//         });
  
//       let info = await transporter.sendMail({
//         from: "info@43inca.org",
//         to: email,
//         subject: "Registeration for 43 rd INCA event ✔",
//         html: `
//               <div>
//               <P>
//                   Dear ${name},<br>
//                   <p>
//                   Thank you for registering yourself for 43rd INCA International Conference.
//                   </P>
//               </P>              
//               <p>
//               Please contact the local organizing committee for queries.<br>
//             Organising Secretary<br>
//             Moblie Number : 91 291 2796395<br>
//             Email : info@43inca.org<br>          
//             Address : Regional Remote Sensing Centre-West, NRSC/ISRO<br>
//             ISRO Complex, Bypass Road<br>
//             Sector 9, Kudi Bhagtasani Housing Board (KBHB)<br>
//             Jodhpur - 342 005, Rajasthan, India
//               </p>
//            </div>
//            <div>
//               <p>
//               Thanks & Regards,<br>
//                   43 INCA<br>
//                   ISRO, Jodhpur
//               </p>
//            </div>
//            <div>
//               <p>
//                   This is system generated email. Please do not reply to this. 
//               </p>
//            </div>
//                `,
//       });
  
//       if (info.messageId) {
//         return info;
//       }
//     } catch (err) {
//       return err;
//     }
//   };




