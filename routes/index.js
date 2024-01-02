const express = require('express');
const router = express.Router();
const passport = require("passport");
const initializePassport = require("../config/passport.config");
const bcrypt = require("bcryptjs");
const { notAuth, isAuth, CheckEmail, CheckUser, InsertNewStaff } = require('../controller/user.controller');
const { CheckAccess } = require('../controller/web.controller');
initializePassport(passport);

/* GET home page. */
router.get('/', notAuth, function (req, res, next) {
    res.render('index/index', { title: 'Welcome' });
});

router.get('/signup', notAuth, function (req, res, next) {
    res.render('index/signup', { message: '', title: 'Welcome' });
});

router.post('/signup', notAuth, async function (req, res, next) {
    let errors = [];
    let { fullname, age, country_of_residents, userid, email, phone, area_of_expertise, password, password2, tac } = req.body;

    console.log(req.body);

    if (!fullname || !age || !country_of_residents || !userid || !email || !phone || !area_of_expertise || !password || !password2 || !tac) {
        errors.push({ message: "Enter all fields" });
    }
    if (age && age > 80 || age.includes(".")) {
        errors.push({ message: "Age Not Accepted" });
    }
    if (password && password.length < 6) {
        errors.push({ message: "Password must be a least 6 characters long" });
    }
    if (password !== password2) {
        errors.push({ message: "Passwords do not match" });
    }
    if (errors.length > 0) {
        console.log(errors);
        res.render('index/signup', { message: errors, title: 'Sign Up' })
    } else {
        let emailExists = await CheckEmail(email);
        let userExists = await CheckUser(userid);

        if (!emailExists) {
            if (!userExists) {
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(password, salt, async function (err, hash) {
                        let insertStaff = await InsertNewStaff(fullname, age, country_of_residents, userid, email, phone, area_of_expertise, hash, tac);
                        if(insertStaff){
                            res.redirect('/');
                        } else {
                            errors.push({ message: "Unknown err occured" });
                            res.render('index/signup', { message: errors, title: 'Sign Up' })
                        }
                    })
                })
            } else {
                errors.push({ message: "User with the same Userid exists" });
                res.render('index/signup', { message: errors, title: 'Sign Up' })
            }
        } else {
            errors.push({ message: "User with the same Email exists" });
            res.render('index/signup', { message: errors, title: 'Sign Up' })
        }
    }
});

router.get('/term-and-conditions', notAuth, function (req, res, next) {
    res.render('index/term_and_conditions', { title: 'Welcome' });
});

router.post('/', passport.authenticate("auth-login",
    {
        failureRedirect: '/',
        successRedirect: '/redirect',
        failureFlash: true
    })
);

module.exports = router;
