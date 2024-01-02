const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const initializePassport = require("../../config/passport.config");
const bcrypt = require("bcryptjs");
const {notAuth, isAuth, CheckEmail, CheckUser, InsertNewClient} = require("../../controller/user.controller");
const {CheckAccess} = require("../../controller/user.controller");
const { Login } = require("../controllers/user/route_controller/login.controller");
const { SignUp } = require("../controllers/user/route_controller/signup.controller");
initializePassport(passport);

/* Login Starts*/
router.get("/", notAuth, function (req, res, next) {
    res.send("client api");
});

router.post("/signup", SignUp);
router.post("/login", Login);

router.get("/user/protected", passport.authenticate("jwt", {session: false}), (req, res, next) => {
    res.json({user: req.user});
});

module.exports = router;