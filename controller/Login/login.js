var jwt = require('jsonwebtoken');
let users = require('../../models/user')

function generateAccessToken(id) {
    return jwt.sign({ id }, "6210607b75c134501baa290c", { expiresIn: '1800s' });
}


exports.login = async (req, res) => {
    let { userEmail, password } = req.body
    if (userEmail == "" && password == "") {
        return res.send({ message: "Please fill the field" })
    }

    else {
        let user = await users.findOne({ userEmail })
        if (user) {
            if (user.userEmail.trim().toLowerCase() == userEmail.trim().toLowerCase() &&
                user.password.trim().toLowerCase() == password.trim().toLowerCase()) {
                let token = generateAccessToken(user._id)
                res.send({ token, message: "Logged in successfully" })
            }

            else if (user.userEmail.trim().toLowerCase() !== userEmail.trim().toLowerCase()) {
                res.status(401).send("Please enter valid email")
            }

            else if (user.password.trim().toLowerCase() !== password.trim().toLowerCase()) {
                res.status(401).send("Please enter valid password")
            }
        }
        else {
            res.send({ message: "Please enter valid email and password" })
        }
    }
}