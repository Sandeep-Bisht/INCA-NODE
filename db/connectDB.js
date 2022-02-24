const dotenv = require("dotenv");
dotenv.config();
const mongoose = require('mongoose');
mongoose.connect(process.env.db_url, {
    auth: {
        "username": "NHOEventsdmin",
        "password": "SOSh3AWDPC4499GTbYhxY8",
    },
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB connection established')
}).catch((err) => {
    console.log(err)
})
