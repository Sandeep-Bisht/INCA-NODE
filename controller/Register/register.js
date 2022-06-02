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
        let response = await sendEmailViaSmtp(userName, userEmail, user.password);
        if (response.messageId) {
          emailSendStatus = true;
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
