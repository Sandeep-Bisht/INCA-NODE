const nodemailer = require("nodemailer");
var generator = require("generate-password");
let users = require("../../models/user");

let generatePassword = () => {
  let password = generator.generate({
    length: 10,
    numbers: true,
  });
  return password;
};

let sendEmailToAdmin = async (userName, userEmail) => {
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
      subject: "Register for 43rd INCA event ✔",
      html: `
            <div>
            <P>
                Dear Admin,<br>
                <p>
                <b> ${userName}, has register with this email address : ${userEmail}</b>
                for 43rd INCA International Conference.
                </P>
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
      subject: "Register for 43rd INCA event ✔",
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
                43rd INCA<br>
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
  const res = await users.findOne({ userEmail: userEmail });
  if (res !== null) {
    return false;
  }
  return true;
};

exports.register = async (req, res) => {
  let emailSendStatus;
  let { userName, userEmail, mobileNumber, role } = req.body;
  if (userEmail && userName && mobileNumber) {
    if (await addUniqueUsers(userEmail)) {
      let user = new users({
        userName,
        userEmail,
        mobileNumber,
        role,
        password: generatePassword(),
      });
      try {
        let saveEntry = await user.save();
        let response = await sendEmailViaSmtp(
          userName,
          userEmail,
          user.password
        );
        if (response.messageId) {
          let res = await sendEmailToAdmin(userName, userEmail)
          if(res){
          emailSendStatus = true;
          }          
        } else {
          emailSendStatus = false;
        }
        res.send({
          emailSendStatus,
          message:
            "You are Successfully Registred, please check your registred email for Credentials.",
        });
      } catch (error) {
        res.send({ message: "Error occured while registring user", error });
      }
    } else {
      res.send({ message: "user is already registered with this email" });
    }
  } else {
    res.send({ message: "Please fill all the fields" });
  }
};
