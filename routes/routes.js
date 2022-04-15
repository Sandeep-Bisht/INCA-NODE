const express = require('express');
var router = express.Router();

const multer = require('multer')

const fileStorageEngine =  multer.diskStorage({
    destination: (req, file, cb ) => {
        cb(null, './files')

    },
    filename:(req, file, cb ) => {
        cb(null, Date.now() + "--" + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'text/plain' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ) {
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}

const upload = multer({storage: fileStorageEngine, fileFilter:fileFilter})

const { register } = require('../controller/Register/register')
const { login } = require('../controller/Login/login')
const {checkAuthentication} = require('../middleware')
const { forgotPassword, verifyRegisteredEmail, changePassword } = require('../controller/Passwords')
const { getUsers,  deleteUser } = require('../controller/users/user')
const { saveRegistredUserInfo } = require('../controller/SaveRegistredUserInfo')
const { getAllRegistredUsersData, updateSaveRegistredUserInfoById, getRegistredUserInfoById } = require('../controller/GetRegistredUserInfo')
const { saveSponsor, getSponsors } = require('../controller/SaveSponsor')
const { uploadUserFiles } = require('../controller/FileSubmission')
const { getCounters } = require('../controller/Counters')
const { handle404Route } = require('../controller/404')


router.post('/signup', register)
router.post('/login', login)
router.get('/users', checkAuthentication,   getUsers )
router.delete('/user/:id', checkAuthentication, deleteUser)
router.post('/verify', checkAuthentication, verifyRegisteredEmail)
router.post('/changepassword', checkAuthentication, changePassword)
router.post('/forgot', checkAuthentication, forgotPassword)
router.post('/saveregistreduser', checkAuthentication, saveRegistredUserInfo)
router.get('/getregistreduserinfo', checkAuthentication, getAllRegistredUsersData)
router.put('/updateregisteruserinfo/:id', checkAuthentication, updateSaveRegistredUserInfoById)
router.get('/getsaveregistreduserinfo/:id',checkAuthentication, getRegistredUserInfoById )
router.post('/savesponsor',  saveSponsor )
router.post('/uploaddocument',checkAuthentication, upload.single("file"), uploadUserFiles)
router.get('/sponsor', checkAuthentication,  getSponsors)
router.get('/counters', getCounters)
router.get('/*', handle404Route ) 

module.exports = router; 