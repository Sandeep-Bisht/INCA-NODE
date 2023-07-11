const dotenv = require("dotenv");
dotenv.config();
const mongoose = require('mongoose');
const { errorMonitor } = require("nodemailer/lib/xoauth2");
mongoose.connect(process.env.db_url, {
    auth: {
        // "username": "NHOEventsdmin",
        "username" : "NHOEventsdmin",
        "password": "SOSh3AWDPC4499GTbYhxY8"
        // "password": "Giks@123456789",
    },
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected")
}).catch((err) => {
    console.log(err)
})
