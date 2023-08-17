const express = require("express");
var router = express.Router();

const multer = require("multer");

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./files");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "text/plain" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: fileStorageEngine, fileFilter: fileFilter });

const { register } = require("../controller/Register/register");
const { login } = require("../controller/Login/login");
const { checkAuthentication } = require("../middleware");
const { forgotPassword } = require("../controller/Passwords");
const { getUsers, deactivateUser, activateUser } = require("../controller/users/user");
const {
  saveRegistredUserInfo,
} = require("../controller/SaveRegistredUserInfo");
const {
  getAllRegistredUsersData,
  updateSaveRegistredUserInfoById,
  getRegistredUserInfoById,
} = require("../controller/GetRegistredUserInfo");
const { saveSponsor, getSponsors } = require("../controller/SaveSponsor");
const {
  uploadUserFiles,
  saveAbstractPaper,
  getAbstractPaper,
  getAbstractPaperById,
  approveAbstractPaperByAdmin,
  deleteAbstractPaper,
  saveOnlyAbstractFile
} = require("../controller/AbstractFileSubmission");
// ========================
const { uploadUserFullPaperFiles, saveFullPaper, getFullPaper, getFullPaperById } = require('../controller/FullPaperSubmission')
const { getCounters } = require('../controller/Counters')
const { getRegistredUserExcel } = require('../controller/DownloadRegistredUserExcel')
const { verifyAttendanceStatus, verifyAttendanceStatusByPassword, getUserInfoForAttendance } = require('../controller/AttendanceStatus')
const { paymentIntegration } = require('../controller/Razorpay')
const { saveExhibitorData, getExhibitorData } = require('../controller/Exhibitor')
const { saveUserMannualTransactionDetails, getMannualPaymentInfo, getPaymentStatusById } = require('../controller/MannualPayment')
const { updateFeeManuallyByAdmin , sendQrCodeToUserOnEmail, getUserInfoForQr} = require("../controller/UpdateFeeManually")
const {downloadAbstractUserList} = require('../controller/DownloadAbstractUploadUserList')
const {downloadFullPaperList} = require('../controller/DownloadFullPaperList')
const{ downloadUserExcelList} = require('../controller/DownloadUserExcel')
const {getUserInfoForCertificate, sendEmailToUserForDownloadCertificate} = require('../controller/DownloadCertificate')
const {getRegistredUserInfoByEmail} = require('../controller/GetRegistredUserInfoByEmail')
const {sendEmailToAllUsers} = require('../controller/SendMailToUser')
// sendEmailToAllUsers
const { handle404Route } = require('../controller/404');
const { contactInca } = require("../controller/ContactUsController")


router.post("/signup", register);
router.post("/login", login);
router.get("/users", checkAuthentication, getUsers);
router.post("/saveregistreduser", checkAuthentication, saveRegistredUserInfo);
router.get(
  "/getregistreduserinfo",
  checkAuthentication,
  getAllRegistredUsersData
);
router.put(
  "/updateregisteruserinfo/:id",
  checkAuthentication,
  updateSaveRegistredUserInfoById
);
router.get("/getsaveregistreduserinfo/:id", getRegistredUserInfoById);
router.post("/savesponsor", saveSponsor);
router.post("/uploaddocument", upload.single("file"), uploadUserFiles);
router.post("/uploadfullPaperdocument", upload.single("file"), uploadUserFullPaperFiles);

router.post("/contact-us", checkAuthentication, contactInca);
router.get("/sponsor", checkAuthentication, getSponsors);
router.get("/counters", checkAuthentication, getCounters);
router.post("/saveabstractpaper", checkAuthentication, saveAbstractPaper);
router.post("/saveOnlyAbstractFile", checkAuthentication, saveAbstractPaper);
router.get("/getabstractpaper", checkAuthentication, getAbstractPaper);
router.get("/getabstractpaper/:userId", getAbstractPaperById),
router.delete("/delete_abstract_by_id/:abstractId", deleteAbstractPaper),
router.delete("/delete_user_by_id/:userId", deactivateUser),
router.put("/activate_user_by_id/:userId", activateUser),
  router.put("/approvefilesubmission", approveAbstractPaperByAdmin);
router.post("/fullPaperSubmition", checkAuthentication, saveFullPaper);
router.get("/getFullPaperList", checkAuthentication, getFullPaper);
router.get("/getFullPaperList/:userId", getFullPaperById),
  router.get("/downloadexcel", getRegistredUserExcel),
  router.post("/attendance/:id", checkAuthentication, verifyAttendanceStatus);
router.post("/markattendances", verifyAttendanceStatusByPassword);
router.get("/getuserinfoforattendance/:id", getUserInfoForAttendance);

router.get('/sponsor', checkAuthentication,  getSponsors)
router.get('/counters', checkAuthentication, getCounters)
router.post('/saveabstractpaper', checkAuthentication, saveAbstractPaper);
router.get('/getabstractpaper', checkAuthentication, getAbstractPaper);
router.get('/getabstractpaper/:userId', getAbstractPaperById),
router.put('/approvefilesubmission', approveAbstractPaperByAdmin)
router.post('/fullPaperSubmition', checkAuthentication, saveFullPaper )
router.get('/getFullPaperList',checkAuthentication, getFullPaper);
router.get('/getFullPaperList/:userId', getFullPaperById),
router.get('/downloadexcel',  getRegistredUserExcel),
router.post('/attendance/:id',checkAuthentication, verifyAttendanceStatus)
router.post('/markattendances', verifyAttendanceStatusByPassword )
router.get('/getuserinfoforattendance/:id', getUserInfoForAttendance)

router.put('/forgot', forgotPassword)
router.post('/payment', paymentIntegration)
router.post('/exhibitor', saveExhibitorData )
router.get('/getexhibitor', getExhibitorData)
router.post('/savepaymentdetails', saveUserMannualTransactionDetails)
router.get('/getPaymentStatus/:id', getPaymentStatusById)
router.get('/transaction',checkAuthentication, getMannualPaymentInfo)
router.get("/update_transction_details/:id", updateFeeManuallyByAdmin)
router.get('/generateqrcode/:id', sendQrCodeToUserOnEmail)
router.get('/download_abstarct_list', downloadAbstractUserList)
router.get('/download_fullPaper_list', downloadFullPaperList)
router.get('/getuserqrinfo/:id', getUserInfoForQr)
router.get('/userexcel',downloadUserExcelList )
router.get('/generate_certificate/:id', getUserInfoForCertificate)
router.get('/sendemailtodownloadcertificate/:id', sendEmailToUserForDownloadCertificate )
router.get('/sendEmailToAllUsers/:id', sendEmailToAllUsers )
// sendEmailToAllUsers
router.get('/getuserinfo/:id', getRegistredUserInfoByEmail)
// getRegistredUserInfoByEmail
router.get("/*", handle404Route);

module.exports = router;
