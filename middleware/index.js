const jwt = require('jsonwebtoken')
let users = require('../models/user')


exports.checkAuthentication = (req, res, next) => {
    console.log(req.headers,'dsafds')
    const { authorization } = req.headers ;
    console.log(authorization, 'auth')
    if(!authorization){
        return res.status(401).send({error:"You must be loginnn"})
    }
     const token = authorization.replace("Bearer ", "");
     jwt.verify(token,"6210607b75c134501baa290c", async(err,payload)=>{
         if(err){
            return res.status(401).send({error:"You must be login"})
         }
        next(); 
     })
}