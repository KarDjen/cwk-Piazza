// USING CODES PROVIDED IN LAB 4


// IMPORT JOI AND PROHIBITED KEYWORDS
const joi = require('joi'); // for data validation
const {prohibitedKeywords} = require('../routes/interactions.js'); // prohibited keywords for username validation


// VALIDATION EMAIL
const emailValidation = joi.string().required().min(3).max(256).email().messages({'string.email': 'Email must be a valid email address'});


// VALIDATION PASSWORD
// Use regex pattern to add layer of security
const passwordValidation = joi.string().required().min(6).max(1024)
                              .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})'))
                              .messages({
                                  'string.pattern.base': 'Password must have at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)',
                                  'string.min': 'Password must be at least 6 characters long',
                                  'string.max': 'Password must be less than 1024 characters long'
                              });


// VALIDATION USERNAME
// Use prohibited keywords to safeguard respect in Piazza community
const usernameValidation = joi.string().required().min(3).max(256).custom((value, helpers) => {
    const lowerCaseValue = value.toLowerCase();
    if (prohibitedKeywords().some(keyword => keyword.toLowerCase() === lowerCaseValue)) {
        return helpers.error('string.invalidUsername');
    }
    return value;
}, 'Prohibited Keyword Check').messages({
    'string.base': 'Username is required',
    'string.min': 'Username must be at least 3 characters long',
    'string.invalidUsername': 'Username contains prohibited content'
});


// VALIDATION USER REGISTRATION
const registerValidation = (data) => {
    const schemaValidation = joi.object({
        username: usernameValidation,
        email:emailValidation,
        password:passwordValidation
    })
    return schemaValidation.validate(data)
}


// VALIDATION USER LOGIN
const loginValidation = (data) => {
    const schemaValidation = joi.object({
        email:emailValidation,
        password:passwordValidation
    })
    return schemaValidation.validate(data)
}


module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation