const dotenv = require("dotenv");
dotenv.config();
const mongoose = require('mongoose');
mongoose.connect(process.env.db_url, {
    auth: {
        "username": "NHOEventsdmin",
        "password": "Giks@123456789",
    },
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
}).catch((err) => {
})
