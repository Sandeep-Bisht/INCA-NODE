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
const { forgotPassword } = require('../controller/Passwords')
const { getUsers,  deleteUser } = require('../controller/users/user')
const { saveRegistredUserInfo } = require('../controller/SaveRegistredUserInfo')
const { getAllRegistredUsersData, updateSaveRegistredUserInfoById, getRegistredUserInfoById } = require('../controller/GetRegistredUserInfo')
const { saveSponsor, getSponsors } = require('../controller/SaveSponsor')
const { uploadUserFiles, saveAbstractPaper, getAbstractPaper, getAbstractPaperById, approveAbstractPaperByAdmin } = require('../controller/AbstractFileSubmission')
const { getCounters } = require('../controller/Counters')
const { getRegistredUserExcel } = require('../controller/DownloadRegistredUserExcel')
const { verifyAttendanceStatus, verifyAttendanceStatusByPassword, getUserInfoForAttendance } = require('../controller/AttendanceStatus')
const { paymentIntegration } = require('../controller/Razorpay')
const { saveExhibitorData, getExhibitorData } = require('../controller/Exhibitor')
const { saveUserMannualTransactionDetails, getMannualPaymentInfo } = require('../controller/MannualPayment')
const { updateFeeManuallyByAdmin } = require("../controller/UpdateFeeManually")
const {downloadAbstractUserList} = require('../controller/DownloadAbstractUploadUserList')
const { handle404Route } = require('../controller/404')


router.post('/signup', register)
router.post('/login', login)
router.get('/users', checkAuthentication, getUsers )
router.post('/saveregistreduser',checkAuthentication, saveRegistredUserInfo)
router.get('/getregistreduserinfo', checkAuthentication, getAllRegistredUsersData)
router.put('/updateregisteruserinfo/:id', checkAuthentication, updateSaveRegistredUserInfoById)
router.get('/getsaveregistreduserinfo/:id',checkAuthentication, getRegistredUserInfoById )
router.post('/savesponsor',  saveSponsor )
router.post('/uploaddocument', upload.single("file"), uploadUserFiles)
router.get('/sponsor', checkAuthentication,  getSponsors)
router.get('/counters', checkAuthentication, getCounters)
router.post('/saveabstractpaper', checkAuthentication, saveAbstractPaper);
router.get('/getabstractpaper', checkAuthentication, getAbstractPaper);
router.get('/getabstractpaper/:userId', getAbstractPaperById),
router.put('/approvefilesubmission', approveAbstractPaperByAdmin)
router.get('/downloadexcel',  getRegistredUserExcel),
router.post('/attendance/:id',checkAuthentication, verifyAttendanceStatus)
router.post('/markattendances', verifyAttendanceStatusByPassword )
router.get('/getuserinfoforattendance/:id', checkAuthentication, getUserInfoForAttendance)
router.put('/forgot', forgotPassword)
router.post('/payment', paymentIntegration)
router.post('/exhibitor', saveExhibitorData )
router.get('/getexhibitor', getExhibitorData)
router.post('/savepaymentdetails', saveUserMannualTransactionDetails)
router.get('/transaction',checkAuthentication, getMannualPaymentInfo)
router.get("/update_transction_details/:id", checkAuthentication, updateFeeManuallyByAdmin)
router.get('/download_abstarct_list',checkAuthentication, downloadAbstractUserList)

router.get('/*', handle404Route ) 

module.exports = router; 