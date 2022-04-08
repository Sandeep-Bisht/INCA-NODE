const express = require('express');
var router = express.Router();

const { register } = require('../controller/Register/register')
const { login } = require('../controller/Login/login')
const {checkAuthentication} = require('../middleware')
const { forgotPassword, verifyRegisteredEmail, changePassword } = require('../controller/Passwords')
const { getUsers,  deleteUser } = require('../controller/users/user')
const { saveRegistredUserInfo } = require('../controller/SaveRegistredUserInfo')
const { getAllRegistredUsersData } = require('../controller/GetRegistredUserInfo')
const { saveSponsor, getSponsors } = require('../controller/SaveSponsor')
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
router.post('/savesponsor',  saveSponsor )
router.get('/sponsor',  getSponsors)
router.get('/*', handle404Route ) 

module.exports = router; 