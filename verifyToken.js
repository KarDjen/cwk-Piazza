// USING CODES PROVIDED IN LAB 4.1
const jsonwebtoken = require('jsonwebtoken')

function auth(req,res,next){

    // CHECK IF TOKEN EXISTS
    const token = req.header('auth-token')
    if (!token) return res.status(401).send({message:'Access denied'})

    // CHECK IF TOKEN IS CORRECT
    try{
        const verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    }catch (err){
        return res.status(401).send({message:'Invalid token'})
    }
}

module.exports = auth