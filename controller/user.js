const { validationResult } = require('express-validator/check');

const User = require('../models/user');
const userValidation = require('../middlewares/user');

function getNewUser(body){
    return new User(body)
}

async function createUser(req, res, next) {
    try {
        const errors = validationResult(req)
        const user = req.body;
        if (!errors.isEmpty()) {
            const firstNameErr = errors.array().find(e => e.msg === userValidation.fieldRequired)
            const lastNameErr = errors.array().find(e => e.msg === userValidation.fieldRequired)
            const roleErr = errors.array().find(e => e.msg === userValidation.roleRequired)
            const usernameErr = errors.array().find(e => e.msg === userValidation.usernameRequired)
            const emailErr = errors.array().find(e => e.msg === userValidation.emailRequired)
            const passwordErr = errors.array().find(e => e.msg === userValidation.passwordRequired)
            const confirmPasswordErr = errors.array().find(e => e.msg === userValidation.confirmpasswordRequired)
            res.render('user/register', {
                title: 'Create User',
                user,
                firstNameErr,
                lastNameErr,
                roleErr,
                usernameErr,
                emailErr,
                passwordErr,
                confirmPasswordErr
            })
        } else {
            const newUser = getNewUser(req.body);
            await newUser.setHashPassword()
            newUser.save({});
            res.redirect('/auth/login')
        }
    } catch (error) {
        return res.status(500).send("Something went wrong! Please try again.")
    }
}

module.exports = {
    createUser,
    getNewUser
}
