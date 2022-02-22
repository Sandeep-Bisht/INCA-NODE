const dotenv = require("dotenv");
dotenv.config();
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('DB connection established')
}).catch((err) => {
    console.log(err)
})
