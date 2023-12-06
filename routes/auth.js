// IMPORTING MODULES AND INITIAL SETUP
const express = require('express')
const router = express.Router();

const User = require('../models/User');
const {registerValidation, loginValidation} = require('../validations/validation')

const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')


// REGISTRATION ROUTE
router.post('/register', async(req, res) => {


    // validation 1 to check user input
    const {error} = registerValidation(req.body)
    if (error) return res.status(400).send({message: error.details[0].message})


    // Validation 2 to check if user exists
    const userExists = await User.findOne({email:req.body.email})
    if (userExists) return res.status(400).send({message: "Sorry, that one is already taken. Try logging in instead or use another email or just call your momma for help!"})


    // Hash the password
    const salt = await bcryptjs.genSalt(5)
    const hashedPassword = await bcryptjs.hash(req.body.password, salt)


    // Creating and saving a new user
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    })


    try{
        const savedUser = await user.save()
        res.send(savedUser)
    }catch(err) {
        res.status(400).send({message: err})
    }
})


// LOGIN ROUTE
router.post('/login', async(req, res) =>{


    // validation 1 to check user input
    const {error} = loginValidation(req.body)
    if (error) return res.status(400).send({message: error.details[0].message})


    // Validation 2 to check if user exists
    const user = await User.findOne({email:req.body.email})
    if (!user) return res.status(400).send({message: "\"Hmmmm looks like our dedicated Takeshi can't find you... Are you sure you're one of us?\""})


    // Validation 3 to check user password
    const passwordValidation = await bcryptjs.compare(req.body.password,user.password)
    if (!passwordValidation) return res.status(400).send({message: "\"Oops! Wrong password. If you try one more incorrect password, we'll have to lock you out...Feeling the pressure?! Relax, we have not implemented that yet...or!"})


    // IMPLEMENT ACTION 1: Authorised users access the Piazza API using the oAuth v2 protocol to perform any interaction.
    // Generate an auth-token
    try{
        const token = jsonwebtoken.sign({ username: user.username, email: user.email }, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send({'auth-token': token});
    } catch (err){
        res.status(500).send('Error generating authentication token.');
    }
})


module.exports = router;