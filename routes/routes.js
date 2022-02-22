const express = require('express');
var router = express.Router();

const { register } = require('../controller/Register/register')
const { login } = require('../controller/Login/login')
const { forgotPassword, verifyRegisteredEmail, changePassword } = require('../controller/Passwords')
const { getUsers,  deleteUser, } = require('../controller/users/user')


router.post('/signup', register)
router.post('/login', login)
router.post('/forgot', forgotPassword)
router.get('/users', getUsers )
router.delete('/users/:id', deleteUser)

// verify Email api

router.post('/verify', verifyRegisteredEmail)
router.post('/changepassword', changePassword)

module.exports = router;