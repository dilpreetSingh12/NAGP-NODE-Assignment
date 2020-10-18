const express = require('express');
const router = express.Router();
const passport = require('passport');
const userValidation = require('../middlewares/user');
const userController = require('../controller/user');


/* Register a new user */
router.post('/register', userValidation.validate('createUser'), userController.createUser);

/* Login user */
router.get('/login',function(req, res, next) {
    res.render('login', {title: 'Express', isUserLoggedIn: false})
});

router.post('/login', passport.authenticate('local', {session: false} ), function(req, res, next) {
    var response = req.user.toAuthJson()
    res.cookie('auth', response['token'])
    res.redirect('/positions/position')
});


router.get('/register', function(req, res, next) {
    res.render('user/register', {title: 'Register', isUserLoggedI: false})
})

router.get('/logout', function(req, res){
    req.logout();
    res.clearCookie('auth')
    res.redirect('/auth/login');
  });

module.exports = router;
