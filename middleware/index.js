const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
let users = require('../models/user')

exports.checkAuthentication = (req, res, next) => {
    console.log(req.headers,'dsafds')
    if(!req.headers.hasOwnProperty("authorization")){
        next()
        //return
    }
    else {
    const { authorization } = req.headers;
    console.log(authorization, 'authorization')
    if (!authorization) {
        return res.status(401).send({ error: "You must be login" })
    }

    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, "6210607b75c134501baa290c", async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: "You must be login" })
        }
        const { id } = payload
        const user = await users.findById(id)
        req.user = user;
        next();
    })
    }
   return
}
