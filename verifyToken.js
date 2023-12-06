// We have used codes provided in lab 4 for convenience.
// Middleware function that will check 1) No token 2) Incorrect token
const jsonwebtoken = require('jsonwebtoken')

function auth(req,res,next){

    const token = req.header('auth-token')
    if (!token) return res.status(401).send({messages:'Access denied'})

    try{
        const verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    }catch (err){
        return res.status(401).send({messages:'Invalid token'})
    }
}

module.exports = auth