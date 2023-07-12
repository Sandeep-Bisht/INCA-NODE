const dotenv = require("dotenv");
dotenv.config();
const mongoose = require('mongoose');
const { errorMonitor } = require("nodemailer/lib/xoauth2");
mongoose.connect(process.env.db_url, {
    auth: {
        // "username": "NHOEventsdmin",
        "username" : "NHOEventsdmin",
        "password": "SOSh3AWDPC4499GTbYhxY8"
        // "password": "Inca@0623456789",
    },
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected")
}).catch((err) => {
    console.log(err)
})
