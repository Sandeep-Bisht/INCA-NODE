const express = require('express');
var router = express.Router();

const { register } = require('../controller/Register/register')
const { login } = require('../controller/Login/login')
const { forgotPassword, verifyRegisteredEmail, changePassword } = require('../controller/Passwords')
const { getUsers,  deleteUser } = require('../controller/users/user')
const { saveRegistredUserInfo } = require('../controller/SaveRegistredUserInfo')
const { getAllRegistredUsersData } = require('../controller/GetRegistredUserInfo')


router.post('/signup', register)
router.post('/login', login)
router.get('/users',   getUsers )
router.delete('/user/:id', deleteUser)
router.post('/verify', verifyRegisteredEmail)
router.post('/changepassword', changePassword)
router.post('/forgot', forgotPassword)
router.post('/saveregistreduser', saveRegistredUserInfo)
router.get('/getregistreduserinfo', getAllRegistredUsersData)

module.exports = router; 