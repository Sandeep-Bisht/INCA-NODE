const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./db/connectDB');
const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


let routes = require('./routes/routes')
app.use("/files", express.static("files"));
app.use("/qrimages", express.static("qrimages"));
app.use('//api', routes)   
// app.use('/api', routes) //local
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server is runningss on PORTs ${PORT}`)
})




